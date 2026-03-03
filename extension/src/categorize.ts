// extension/src/categorize.ts
// ─────────────────────────────────────────────
// Auto-categorizes a URL into one of the 8
// categories from the dashboard's Category type.
//
// Strategy: match against known domains first
// (fast and accurate), then fall back to keyword
// matching against the URL path and page title.
//
// Order matters — more specific rules go first.
// ─────────────────────────────────────────────

export type Category =
  | 'Documentation'
  | 'Tools'
  | 'UI/UX'
  | 'Backend'
  | 'Frontend'
  | 'Community'
  | 'Learning'
  | 'APIs';

// Known domain → category mappings
const DOMAIN_MAP: Record<string, Category> = {
  // Documentation
  'developer.mozilla.org': 'Documentation',
  'docs.github.com': 'Documentation',
  'docs.python.org': 'Documentation',
  'docs.rs': 'Documentation',
  'devdocs.io': 'Documentation',
  'react.dev': 'Documentation',
  'vuejs.org': 'Documentation',
  'angular.io': 'Documentation',
  'nextjs.org': 'Documentation',
  'docs.microsoft.com': 'Documentation',
  'learn.microsoft.com': 'Documentation',
  'docs.aws.amazon.com': 'Documentation',
  'firebase.google.com': 'Documentation',
  'supabase.com': 'Documentation',

  // Tools
  'github.com': 'Tools',
  'gitlab.com': 'Tools',
  'vercel.com': 'Tools',
  'netlify.com': 'Tools',
  'railway.app': 'Tools',
  'render.com': 'Tools',
  'postman.com': 'Tools',
  'insomnia.rest': 'Tools',
  'figma.com': 'Tools',
  'excalidraw.com': 'Tools',
  'notion.so': 'Tools',
  'linear.app': 'Tools',
  'retool.com': 'Tools',
  'regex101.com': 'Tools',
  'codebeautify.org': 'Tools',

  // UI/UX
  'dribbble.com': 'UI/UX',
  'behance.net': 'UI/UX',
  'awwwards.com': 'UI/UX',
  'ui.shadcn.com': 'UI/UX',
  'tailwindcss.com': 'UI/UX',
  'chakra-ui.com': 'UI/UX',
  'mui.com': 'UI/UX',
  'radix-ui.com': 'UI/UX',
  'heroicons.com': 'UI/UX',
  'lucide.dev': 'UI/UX',
  'fonts.google.com': 'UI/UX',
  'coolors.co': 'UI/UX',
  'colorhunt.co': 'UI/UX',
  'svgl.app': 'UI/UX',
  'lottifiles.com': 'UI/UX',

  // APIs
  'rapidapi.com': 'APIs',
  'stripe.com': 'APIs',
  'twilio.com': 'APIs',
  'sendgrid.com': 'APIs',
  'resend.com': 'APIs',
  'openai.com': 'APIs',
  'anthropic.com': 'APIs',
  'cohere.com': 'APIs',
  'api.slack.com': 'APIs',

  // Backend
  'nodejs.org': 'Backend',
  'expressjs.com': 'Backend',
  'fastapi.tiangolo.com': 'Backend',
  'djangoproject.com': 'Backend',
  'laravel.com': 'Backend',
  'postgresql.org': 'Backend',
  'mongodb.com': 'Backend',
  'redis.io': 'Backend',
  'prisma.io': 'Backend',
  'drizzle.team': 'Backend',

  // Frontend
  'codepen.io': 'Frontend',
  'codesandbox.io': 'Frontend',
  'stackblitz.com': 'Frontend',
  'jsfiddle.net': 'Frontend',
  'css-tricks.com': 'Frontend',
  'smashingmagazine.com': 'Frontend',

  // Learning
  'freecodecamp.org': 'Learning',
  'theodinproject.com': 'Learning',
  'coursera.org': 'Learning',
  'udemy.com': 'Learning',
  'frontendmentor.io': 'Learning',
  'leetcode.com': 'Learning',
  'exercism.org': 'Learning',
  'scrimba.com': 'Learning',
  'egghead.io': 'Learning',
  'pluralsight.com': 'Learning',

  // Community
  'stackoverflow.com': 'Community',
  'reddit.com': 'Community',
  'discord.com': 'Community',
  'dev.to': 'Community',
  'hashnode.com': 'Community',
  'medium.com': 'Community',
  'news.ycombinator.com': 'Community',
  'x.com': 'Community',
  'twitter.com': 'Community',
};

// Keyword fallbacks for unknown domains
// Checked against the full URL + page title (lowercased)
const KEYWORD_MAP: { keywords: string[]; category: Category }[] = [
  { keywords: ['docs', 'documentation', 'reference', 'api-reference', 'guide', 'manual'], category: 'Documentation' },
  { keywords: ['ui', 'ux', 'design', 'component', 'icon', 'color', 'font', 'theme', 'css', 'animation'], category: 'UI/UX' },
  { keywords: ['api', 'rest', 'graphql', 'webhook', 'endpoint', 'sdk'], category: 'APIs' },
  { keywords: ['backend', 'server', 'database', 'db', 'sql', 'nosql', 'redis', 'queue', 'cron'], category: 'Backend' },
  { keywords: ['react', 'vue', 'angular', 'svelte', 'frontend', 'html', 'css', 'javascript', 'typescript'], category: 'Frontend' },
  { keywords: ['tutorial', 'learn', 'course', 'lesson', 'exercise', 'challenge', 'practice', 'bootcamp'], category: 'Learning' },
  { keywords: ['forum', 'community', 'discuss', 'thread', 'blog', 'post', 'newsletter'], category: 'Community' },
  { keywords: ['tool', 'generator', 'converter', 'editor', 'playground', 'sandbox', 'devtool'], category: 'Tools' },
];

export function categorize(url: string, title: string = ''): Category {
  try {
    const { hostname } = new URL(url);
    const domain = hostname.replace(/^www\./, '');

    // Exact domain match first
    if (DOMAIN_MAP[domain]) return DOMAIN_MAP[domain];

    // Subdomain match (e.g. docs.something.com → Documentation)
    const parts = domain.split('.');
    if (parts[0] === 'docs' || parts[0] === 'api') return 'Documentation';

    // Keyword match against URL + title
    const searchText = `${url} ${title}`.toLowerCase();
    for (const { keywords, category } of KEYWORD_MAP) {
      if (keywords.some(k => searchText.includes(k))) return category;
    }

  } catch {
    // Invalid URL — fall through to default
  }

  return 'Tools'; // Safe default
}