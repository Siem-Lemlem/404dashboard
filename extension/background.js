// extension/background.js
// ─────────────────────────────────────────────
// Service worker — runs in the background.
// Handles:
// 1. Context menu setup and clicks
// 2. Omnibox search (type "404 <query>" in address bar)
// 3. Message passing between popup and content script
//
// Service workers in MV3 can be terminated at any time
// so never store state here — use chrome.storage instead.
// ─────────────────────────────────────────────

// ── Context Menu Setup ──────────────────────
// Creates the right-click "Save to 404Dashboard" option.
// Must be created in onInstalled to avoid duplicates.
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-to-404dashboard',
    title: 'Save to 404Dashboard',
    contexts: ['page', 'link'],
  });
});

// ── Context Menu Click ───────────────────────
// When user right-clicks → "Save to 404Dashboard"
// Sends the URL to the popup via storage so the
// popup can pick it up when it opens.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'save-to-404dashboard') return;

  // Use the link URL if right-clicking a link, otherwise the page URL
  const url = info.linkUrl ?? info.pageUrl ?? tab?.url ?? '';

  // Store the pending URL — popup reads this on open
  chrome.storage.session.set({ pendingUrl: url });

  // Open the popup
  chrome.action.openPopup();
});

// ── Omnibox ──────────────────────────────────
// Type "404 <query>" in Chrome address bar to search
// your saved resources without opening the full app.
chrome.omnibox.onInputEntered.addListener((text) => {
  // Open dashboard with search query pre-filled
  const dashboardUrl = `https://404dashboard.web.app?search=${encodeURIComponent(text)}`;
  chrome.tabs.create({ url: dashboardUrl });
});

// Provide suggestions as the user types
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  // For now just show a static suggestion
  // Later: query Firestore for matching resources
  suggest([
    {
      content: text,
      description: `Search 404Dashboard for "<match>${text}</match>"`,
    },
  ]);
});

// ── Message Passing ──────────────────────────
// Popup can send messages to background for operations
// that need elevated permissions.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_CURRENT_TAB') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ tab: tabs[0] });
    });
    return true; // Keep channel open for async response
  }
});