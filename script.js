document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const nav = document.querySelector('[data-nav]');

  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const cookieBanner = document.querySelector('[data-cookie-banner]');

  if (cookieBanner) {
    cookieBanner.hidden = true;
    cookieBanner.setAttribute('aria-hidden', 'true');
  }
  document.body.classList.remove('consent-required');
  activateThirdPartyEmbeds();

  function activateThirdPartyEmbeds() {
    document.querySelectorAll('[data-consent-embed]').forEach((box) => {
      if (box.dataset.loaded === 'true') return;
      const type = box.dataset.embedType || 'iframe';

      if (type === 'iframe') {
        const iframe = document.createElement('iframe');
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.src = box.dataset.src;
        iframe.title = box.dataset.title || 'Externer Inhalt';
        iframe.allowFullscreen = true;
        box.innerHTML = '';
        box.classList.add('map-frame');
        box.appendChild(iframe);
      } else if (type === 'script-widget') {
        const container = document.createElement('div');
        const containerId = box.dataset.widgetId;
        if (containerId) container.id = containerId;
        container.style.width = '100%';
        box.innerHTML = '';
        box.appendChild(container);

        const script = document.createElement('script');
        script.src = box.dataset.scriptSrc;
        script.async = true;
        box.appendChild(script);
      }

      box.dataset.loaded = 'true';
    });
  }

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  const yearElement = document.querySelector('[data-year]');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const priceTargets = document.querySelectorAll('[data-price-table]');
  if (priceTargets.length && Array.isArray(window.THREPAIR_PRICES)) {
    priceTargets.forEach((target) => renderPriceTable(target, window.THREPAIR_PRICES));
  }

  function renderPriceTable(target, items) {
    const rows = items.map(item => `
      <tr>
        <td>
          <strong>${item.name}</strong><br>
          <small>${item.note}</small>
        </td>
        <td><span class="price-chip">${item.category}</span></td>
        <td>${item.price}</td>
      </tr>
    `).join('');

    target.innerHTML = `
      <table class="price-table" aria-label="Preisliste">
        <thead>
          <tr>
            <th>Leistung</th>
            <th>Typ</th>
            <th>Preis</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }
});
