// extension/popup.js
// ─────────────────────────────────────────────
// Main popup logic. Runs when the extension icon
// is clicked or the popup is opened by context menu.
//
// Flow:
// 1. Check if user is signed in via chrome.storage
// 2. If not -> show sign-in prompt
// 3. If yes -> fetch current tab metadata
// 4. Auto-fill name, description, category
// 5. User reviews and saves
// 6. Write to Firestore via REST API
//    (Can't use Firebase SDK directly in popup
//     due to MV3 module restrictions — REST is safer)
// ─────────────────────────────────────────────

// ── Firebase REST config ─────────────────────
// Replace with your actual Firebase project values.
// These are the same as your firebaseConfig but
// used for REST calls instead of the SDK.
const FIREBASE_CONFIG = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
};

// ── State ────────────────────────────────────
let currentUser = null; // { uid, idToken, email, displayName }
let tags = [];
let autoCategorized = false;

// ── DOM refs ─────────────────────────────────
const states = {
  loading: document.getElementById('state-loading'),
  auth: document.getElementById('state-auth'),
  form: document.getElementById('state-form'),
  success: document.getElementById('state-success'),
};

const els = {
  userBadge: document.getElementById('user-badge'),
  name: document.getElementById('input-name'),
  url: document.getElementById('input-url'),
  description: document.getElementById('input-description'),
  category: document.getElementById('input-category'),
  autoBadge: document.getElementById('auto-badge'),
  tagsInput: document.getElementById('tags-input'),
  tagsContainer: document.getElementById('tags-container'),
  saveBtn: document.getElementById('btn-save'),
  errorMsg: document.getElementById('error-msg'),
  successMsg: document.getElementById('success-msg'),
  openAppBtn: document.getElementById('btn-open-app'),
  saveAnotherBtn: document.getElementById('btn-save-another'),
};

// ── Show/hide states ─────────────────────────
function showState(name) {
  Object.entries(states).forEach(([key, el]) => {
    el.classList.toggle('active', key === name);
  });
}

function showError(msg) {
  els.errorMsg.textContent = msg;
  els.errorMsg.classList.add('visible');
}

function hideError() {
  els.errorMsg.classList.remove('visible');
}

// ── Tag management ───────────────────────────
function renderTags() {
  // Remove existing tag elements (keep the input)
  const existingTags = els.tagsContainer.querySelectorAll('.tag');
  existingTags.forEach(t => t.remove());

  // Re-render tags before the input
  tags.forEach(tag => {
    const el = document.createElement('span');
    el.className = 'tag';
    el.innerHTML = `${tag} <span class="tag-remove" data-tag="${tag}">×</span>`;
    els.tagsContainer.insertBefore(el, els.tagsInput);
  });
}

els.tagsContainer.addEventListener('click', (e) => {
  // Focus input when clicking the container
  els.tagsInput.focus();

  // Remove tag on × click
  if (e.target.classList.contains('tag-remove')) {
    const tag = e.target.dataset.tag;
    tags = tags.filter(t => t !== tag);
    renderTags();
  }
});

els.tagsInput.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ',') && els.tagsInput.value.trim()) {
    e.preventDefault();
    const tag = els.tagsInput.value.trim().replace(/^#/, '').toLowerCase();
    if (tag && !tags.includes(tag)) {
      tags.push(tag);
      renderTags();
    }
    els.tagsInput.value = '';
  }

  // Delete last tag on backspace with empty input
  if (e.key === 'Backspace' && !els.tagsInput.value && tags.length) {
    tags.pop();
    renderTags();
  }
});

// ── Auto-categorization ──────────────────────
// Matches URL and title against known domains and keywords.
// Same logic as src/categorize.ts but inlined here
// since we can't import TS modules in plain popup.js.
function categorize(url, title = '') {
  const DOMAIN_MAP = {
    'developer.mozilla.org': 'Documentation',
    'docs.github.com': 'Documentation',
    'react.dev': 'Documentation',
    'nextjs.org': 'Documentation',
    'firebase.google.com': 'Documentation',
    'supabase.com': 'Documentation',
    'github.com': 'Tools',
    'vercel.com': 'Tools',
    'figma.com': 'Tools',
    'notion.so': 'Tools',
    'regex101.com': 'Tools',
    'dribbble.com': 'UI/UX',
    'tailwindcss.com': 'UI/UX',
    'ui.shadcn.com': 'UI/UX',
    'lucide.dev': 'UI/UX',
    'coolors.co': 'UI/UX',
    'svgl.app': 'UI/UX',
    'rapidapi.com': 'APIs',
    'stripe.com': 'APIs',
    'openai.com': 'APIs',
    'anthropic.com': 'APIs',
    'resend.com': 'APIs',
    'nodejs.org': 'Backend',
    'prisma.io': 'Backend',
    'mongodb.com': 'Backend',
    'codepen.io': 'Frontend',
    'css-tricks.com': 'Frontend',
    'freecodecamp.org': 'Learning',
    'leetcode.com': 'Learning',
    'coursera.org': 'Learning',
    'stackoverflow.com': 'Community',
    'dev.to': 'Community',
    'reddit.com': 'Community',
  };

  try {
    const { hostname } = new URL(url);
    const domain = hostname.replace(/^www\./, '');

    if (DOMAIN_MAP[domain]) return DOMAIN_MAP[domain];
    if (domain.startsWith('docs.')) return 'Documentation';
    if (domain.startsWith('api.')) return 'APIs';

    const text = `${url} ${title}`.toLowerCase();
    if (/docs|documentation|reference|guide|manual/.test(text)) return 'Documentation';
    if (/ui|ux|design|component|icon|color|font|animation/.test(text)) return 'UI/UX';
    if (/\bapi\b|rest|graphql|webhook|endpoint/.test(text)) return 'APIs';
    if (/backend|server|database|\bsql\b|redis/.test(text)) return 'Backend';
    if (/react|vue|angular|svelte|frontend|html|css/.test(text)) return 'Frontend';
    if (/tutorial|learn|course|lesson|exercise|bootcamp/.test(text)) return 'Learning';
    if (/forum|community|discuss|blog|newsletter/.test(text)) return 'Community';
  } catch { /* invalid url */ }

  return 'Tools';
}

// ── Microlink metadata fetch ─────────────────
async function fetchMetadata(url) {
  try {
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 'success' && data.data) {
      return {
        title: data.data.title || '',
        description: data.data.description || '',
      };
    }
  } catch { /* network error */ }
  return null;
}

// ── Firestore REST write ─────────────────────
// We use the Firestore REST API instead of the SDK
// because MV3 service workers have module import limits.
async function saveToFirestore(uid, idToken, resource) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/users/${uid}/resources`;

  // Convert to Firestore document format
  const toValue = (val) => {
    if (typeof val === 'string') return { stringValue: val };
    if (typeof val === 'boolean') return { booleanValue: val };
    if (val instanceof Array) return {
      arrayValue: { values: val.map(v => ({ stringValue: v })) }
    };
    return { nullValue: null };
  };

  const fields = {
    name: toValue(resource.name),
    url: toValue(resource.url),
    description: toValue(resource.description),
    category: toValue(resource.category),
    tags: toValue(resource.tags),
    pinned: toValue(false),
    collectionIds: toValue([]),
    createdAt: { timestampValue: new Date().toISOString() },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Firestore write failed');
  }

  return res.json();
}

// ── Populate form ────────────────────────────
async function populateForm(tab) {
  // Set URL immediately
  els.url.value = tab.url || '';

  // Try to get metadata from content script first (faster, no network)
  let title = tab.title || '';
  let description = '';

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_METADATA' });
    if (response) {
      title = response.title || title;
      description = response.description || '';
    }
  } catch {
    // Content script not available (e.g. chrome:// pages)
    // Fall through to microlink
  }

  els.name.value = title;
  els.description.value = description;

  // Auto-categorize
  const category = categorize(tab.url, title);
  els.category.value = category;
  autoCategorized = true;
  els.autoBadge.style.display = 'inline-block';

  // If no description from page, fetch from microlink in background
  if (!description && tab.url) {
    fetchMetadata(tab.url).then(meta => {
      if (meta?.description && !els.description.value) {
        els.description.value = meta.description;
      }
      if (meta?.title && !els.name.value) {
        els.name.value = meta.title;
      }
    });
  }
}

// ── Save handler ─────────────────────────────
els.saveBtn.addEventListener('click', async () => {
  hideError();

  const name = els.name.value.trim();
  const url = els.url.value.trim();
  const description = els.description.value.trim();
  const category = els.category.value;

  if (!name) { showError('Name is required.'); return; }
  if (!url) { showError('URL is required.'); return; }

  try { new URL(url); } catch {
    showError('Please enter a valid URL.');
    return;
  }

  els.saveBtn.disabled = true;
  els.saveBtn.textContent = 'Saving...';

  try {
    await saveToFirestore(currentUser.uid, currentUser.idToken, {
      name,
      url,
      description,
      category,
      tags,
    });

    // Update lastAccessedAt tracking
    chrome.storage.local.set({ lastSaved: { name, url, category } });

    els.successMsg.textContent = `"${name}" saved to your dashboard.`;
    showState('success');
  } catch (err) {
    showError(err.message || 'Failed to save. Please try again.');
    els.saveBtn.disabled = false;
    els.saveBtn.textContent = 'Save resource';
  }
});

// ── Buttons ──────────────────────────────────
els.openAppBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://404dashboard.web.app' });
});

els.saveAnotherBtn.addEventListener('click', () => {
  tags = [];
  renderTags();
  showState('form');
  hideError();
  els.saveBtn.disabled = false;
  els.saveBtn.textContent = 'Save resource';
});

// ── Init ─────────────────────────────────────
// Check auth state from storage (set by the web app
// when user logs in — see integration note below)
async function init() {
  showState('loading');

  // Read auth state saved by the web app
  // The web app must call:
  // chrome.storage.local.set({ auth404: { uid, idToken, email, displayName } })
  // after successful login. See README for integration steps.
  const stored = await chrome.storage.local.get('auth404');
  const auth = stored.auth404;

  if (!auth?.uid || !auth?.idToken) {
    showState('auth');
    return;
  }

  currentUser = auth;
  els.userBadge.textContent = auth.email || '';

  // Check for pending URL from context menu
  const session = await chrome.storage.session.get('pendingUrl');
  if (session.pendingUrl) {
    chrome.storage.session.remove('pendingUrl');
    els.url.value = session.pendingUrl;
    fetchMetadata(session.pendingUrl).then(meta => {
      if (meta?.title) els.name.value = meta.title;
      if (meta?.description) els.description.value = meta.description;
      const category = categorize(session.pendingUrl, meta?.title || '');
      els.category.value = category;
      els.autoBadge.style.display = 'inline-block';
    });
    showState('form');
    return;
  }

  // Get current tab and populate form
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];

  if (!tab?.url || tab.url.startsWith('chrome://')) {
    // Can't save internal Chrome pages
    els.url.value = '';
    els.name.value = '';
    showState('form');
    return;
  }

  await populateForm(tab);
  showState('form');
}

init();