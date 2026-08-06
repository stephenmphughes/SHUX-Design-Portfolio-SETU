document.addEventListener('DOMContentLoaded', async () => {
  const host = document.getElementById('navbar-placeholder');
  if (!host) return;

  // Optional override for GitHub project sites: <div id="navbar-placeholder" data-base="/my-portfolio/">
  const baseAttr = host.dataset.base || '';
  const BASE = baseAttr && !baseAttr.endsWith('/') ? baseAttr + '/' : baseAttr;

  // Try a few likely paths. Live Server will hit the first one.
  const candidates = [
    `${BASE}partials/navbar.html`,
    'partials/navbar.html',
    '/partials/navbar.html'
  ];

  let html = null, lastErr = '', tried = [];

  for (const url of candidates) {
    tried.push(url);
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) { lastErr = `${res.status} ${res.statusText}`; continue; }
      html = await res.text();
      break;
    } catch (e) {
      lastErr = e.message || String(e);
    }
  }

  if (!html) {
    host.innerHTML = `
      <div class="alert alert-danger m-0">
        Navbar failed to load.<br>
        Tried: <code>${tried.join('</code>, <code>')}</code><br>
        Last error: ${lastErr}
      </div>`;
    console.error('[nav] failed', { tried, lastErr });
    return;
  }

  host.innerHTML = html;
  console.log('[nav] injected OK');

  // Disable the current page link to avoid pointless reloads
  const current = (location.pathname.split('/').pop() || 'index.html')
                   .replace(/index\.html$/i, 'index.html')
                   .toLowerCase();

  host.querySelectorAll('a.nav-link, .dropdown-item').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop().toLowerCase();
    if (!href) return;
    const target = href.replace(/index\.html$/i, 'index.html');
    if (target === current) {
      a.classList.add('active', 'disabled');
      a.setAttribute('aria-current', 'page');
      a.addEventListener('click', e => e.preventDefault());
    }
  });
});
