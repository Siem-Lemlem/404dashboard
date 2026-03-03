// extension/content.js
// ─────────────────────────────────────────────
// Injected into every page.
// Reads page metadata that the extension popup
// can't access directly (same-origin restriction).
//
// Responds to messages from the popup asking
// for the current page's metadata.
// ─────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_PAGE_METADATA') {
    // Read meta tags directly from the page DOM
    const getMeta = (name) => {
      const el =
        document.querySelector(`meta[name="${name}"]`) ||
        document.querySelector(`meta[property="og:${name}"]`) ||
        document.querySelector(`meta[property="twitter:${name}"]`);
      return el?.getAttribute('content') ?? '';
    };

    sendResponse({
      title: document.title || getMeta('title'),
      description: getMeta('description'),
      url: window.location.href,
    });
  }

  return true;
});