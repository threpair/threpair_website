const consentKey = 'threpair_consent_v2';

function getConsent(){
  try { return JSON.parse(localStorage.getItem(consentKey) || '{}'); } catch(e){ return {}; }
}
function setConsent(value){ localStorage.setItem(consentKey, JSON.stringify(value)); }
function hasExternalConsent(){ return !!getConsent().external; }

function initCookieBanner(){
  const banner = document.querySelector('[data-cookie-banner]');
  if(!banner) return;
  const state = getConsent();
  if(typeof state.external === 'undefined') banner.style.display = 'block';
  banner.querySelector('[data-accept]')?.addEventListener('click', () => {
    setConsent({ external:true });
    banner.style.display = 'none';
    loadDeferredEmbeds();
  });
  banner.querySelector('[data-decline]')?.addEventListener('click', () => {
    setConsent({ external:false });
    banner.style.display = 'none';
  });
}

function loadDeferredEmbeds(){
  document.querySelectorAll('[data-embed-target]').forEach((target) => {
    if(target.dataset.loaded === 'true') return;
    if(target.dataset.loadMode === 'manual') return;
    loadExternalTarget(target);
  });
}

function loadExternalTarget(target){
  const src = target.dataset.src;
  const kind = target.dataset.kind || 'iframe';
  if(!src || target.dataset.loaded === 'true') return;
  if(kind === 'script'){
    const div = document.createElement('div');
    div.id = target.dataset.widgetId || '';
    div.style.width = '100%';
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    target.innerHTML = '';
    if(div.id) target.appendChild(div);
    target.appendChild(script);
  } else {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    target.innerHTML = '';
    target.appendChild(iframe);
  }
  target.dataset.loaded = 'true';
}

function initLoadButtons(){
  document.querySelectorAll('[data-load-external]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('[data-external-wrapper]');
      const target = wrapper?.querySelector('[data-embed-target]');
      if(!target) return;
      if(hasExternalConsent()) {
        loadExternalTarget(target);
      } else {
        const banner = document.querySelector('[data-cookie-banner]');
        if(banner) banner.style.display = 'block';
      }
    });
  });
}

function initMobileNav(){
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if(!toggle || !nav) return;
  toggle.addEventListener('click', ()=> nav.classList.toggle('open'));
}

function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(item => io.observe(item));
}

function initMagneticButtons(){
  document.querySelectorAll('.btn, .premium-card, .model-pill').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      if(window.matchMedia('(max-width: 900px)').matches) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.03}px, ${y * 0.03}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

function initFloatingActions(){
  if(document.querySelector('.floating-cta')) return;
  const dock = document.createElement('div');
  dock.className = 'floating-cta';
  dock.innerHTML = `
    <a href="https://wa.me/4925649392860?text=Hallo%20ich%20m%C3%B6chte%20einen%20Termin%20vereinbaren">WhatsApp</a>
    <a href="tel:+4925649392860">Anrufen</a>
    <a href="preise.html">Preise</a>
  `;
  document.body.appendChild(dock);
}

function initPriceConfigurator(){
  const root = document.querySelector('[data-price-app]');
  if(!root || !window.REPAIR_DATA) return;

  const state = {
    brandId: window.REPAIR_DATA.brands[0].id,
    search: ''
  };

  const priceSummary = root.querySelector('[data-price-summary]');
  const brandTabs = root.querySelector('[data-brand-tabs]');
  const searchInput = root.querySelector('[data-model-search]');
  const modelGrid = root.querySelector('[data-model-grid]');
  const detail = root.querySelector('[data-model-detail]');
  const modal = document.querySelector('[data-price-modal]');

  function euro(v){ return v == null ? 'Auf Anfrage' : `${v} €`; }

  function currentBrand(){
    return window.REPAIR_DATA.brands.find(b => b.id === state.brandId) || window.REPAIR_DATA.brands[0];
  }

  function filteredModels(){
    const q = state.search.trim().toLowerCase();
    return currentBrand().models.filter(m => !q || m.name.toLowerCase().includes(q));
  }

  function renderTabs(){
    brandTabs.innerHTML = window.REPAIR_DATA.brands.map(brand => `
      <button class="brand-tab ${brand.id === state.brandId ? 'active' : ''}" type="button" data-brand="${brand.id}">
        ${brand.label}
      </button>
    `).join('');
    brandTabs.querySelectorAll('[data-brand]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.brandId = btn.dataset.brand;
        render();
      });
    });
  }

  function renderModels(){
    const models = filteredModels();
    modelGrid.innerHTML = models.length ? models.map((model, index) => `
      <button type="button" class="model-pill ${index === 0 ? 'active' : ''}" data-model="${encodeURIComponent(model.name)}">
        <span>${model.name}</span>
        <small>${currentBrand().label}</small>
      </button>
    `).join('') : `<div class="empty-state">Kein Modell gefunden. Anderes Modell? <a href="https://wa.me/4925649392860?text=Hallo%20ich%20suche%20einen%20Preis%20f%C3%BCr%20ein%20anderes%20Modell">Per WhatsApp anfragen</a>.</div>`;

    const first = models[0];
    if(first) renderDetail(first);

    modelGrid.querySelectorAll('[data-model]').forEach(btn => {
      btn.addEventListener('click', () => {
        modelGrid.querySelectorAll('.model-pill').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        const model = filteredModels().find(m => m.name === decodeURIComponent(btn.dataset.model));
        if(model) renderDetail(model);
      });
    });
  }

  function row(title, values, extra=''){
    return `
      <article class="repair-row premium-card reveal">
        <div class="repair-copy">
          <h3>${title}</h3>
          ${extra ? `<p class="muted">${extra}</p>` : ''}
        </div>
        <div class="repair-prices">${values}</div>
      </article>
    `;
  }

  function infoButton(type, label='Info'){
    return `<button type="button" class="inline-info" data-open-modal="${type}">${label}</button>`;
  }

  function renderDetail(model){
    const brand = currentBrand();
    const html = `
      <div class="detail-card glass-panel">
        <div class="detail-head">
          <div>
            <span class="badge">${brand.label}</span>
            <h2>${model.name}</h2>
            <p class="muted">${brand.note}</p>
          </div>
          <a class="btn btn-success" href="https://wa.me/4925649392860?text=Hallo%20ich%20m%C3%B6chte%20einen%20Preis%20f%C3%BCr%20${encodeURIComponent(model.name)}%20anfragen">Preis anfragen</a>
        </div>

        <div class="repair-list premium-stack">
          ${row('Display', `
            <div class="price-choice">
              <div><strong>Original</strong> ${infoButton('display-original')}</div>
              <div class="price-big">${euro(model.displayOriginal)}</div>
            </div>
            <div class="price-choice">
              <div><strong>Premium / Soft OLED</strong> ${infoButton('display-premium')}</div>
              <div class="price-big">${euro(model.displayPremium)}</div>
            </div>
          `, 'Bei Apple je nach Modell mit Original oder hochwertigem Nachbau. Bei Samsung je nach Verfügbarkeit in passender Qualitätsstufe.')}

          ${row('Akku', `
            <div class="price-choice">
              <div><strong>Original</strong> ${infoButton('battery-original')}</div>
              <div class="price-big">${euro(model.batteryOriginal)}</div>
            </div>
            <div class="price-choice">
              <div><strong>Premium / TI-Chip</strong> ${infoButton('battery-premium')}</div>
              <div class="price-big">${euro(model.batteryPremium)}</div>
            </div>
          `, 'Akkus mit 3 Monaten Garantie – sowohl Original als auch hochwertige Alternative.')}

          ${row('Backcover / Rückseite', `
            <div class="price-choice single">
              <div><strong>Servicepreis</strong></div>
              <div class="price-big">${euro(model.backcover)}</div>
            </div>
          `)}

          ${row('Ladebuchse', `
            <div class="price-choice single">
              <div><strong>Servicepreis</strong></div>
              <div class="price-big">${euro(model.chargeport)}</div>
            </div>
          `, 'Je nach Modell kann zusätzlicher Aufwand nötig sein.')}

          ${row('Kamera', `
            <div class="price-choice single">
              <div><strong>Servicepreis</strong></div>
              <div class="price-big">${euro(model.camera)}</div>
            </div>
          `)}

          ${row('Handy-Reinigung', `
            <div class="price-choice single">
              <div><strong>Lautsprecher, Mikrofon, Ladebuchse</strong></div>
              <div class="price-big">${euro(window.REPAIR_DATA.cleaningPrice)}</div>
            </div>
          `)}
        </div>

        <div class="detail-foot">
          <div class="mini-note"><strong>Garantie:</strong> Original 12 Monate · Nachbau 6 Monate · Akku 3 Monate.</div>
          <div class="mini-note"><strong>Wichtig:</strong> Garantie nur auf das ersetzte Bauteil, nicht auf das gesamte Handy. Keine Garantie bei Wasserschäden oder Schäden außerhalb unseres Einflusses.</div>
        </div>
      </div>
    `;
    detail.innerHTML = html;
    detail.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', () => openPriceModal(btn.dataset.openModal));
    });
    initReveal();
    initMagneticButtons();
  }

  function openPriceModal(type){
    if(!modal) return;
    const content = {
      'display-original': {
        title: 'Original-Display',
        body: 'Original-Ersatzteile sind teurer, bieten aber die größte Nähe zum Ausgangszustand. Bei Apple lassen sich Original-Displays ab iOS 18 je nach Gerät kalibrieren. Garantie auf das ersetzte Bauteil: 12 Monate.'
      },
      'display-premium': {
        title: 'Premium / Soft OLED / hochwertiger Nachbau',
        body: 'Hochwertige Nachbau-Displays wie Soft OLED sind meist günstiger. Es kann der Hinweis erscheinen, dass kein Original-Produkt verbaut ist. Farben, Helligkeit oder Touchgefühl können leicht abweichen, die normale Nutzung wird dadurch in der Regel nicht beeinträchtigt. Garantie auf das ersetzte Bauteil: 6 Monate.'
      },
      'battery-original': {
        title: 'Original-Akku',
        body: 'Original-Akkus sind – je nach Verfügbarkeit – die erste Wahl für maximale Nähe zum Werkszustand. Garantie auf den ersetzten Akku: 3 Monate.'
      },
      'battery-premium': {
        title: 'Hochwertiger Akku mit TI-Chip',
        body: 'Hochwertige Akku-Alternativen mit TI-Chip sind preislich attraktiver und bieten eine starke Alltagsleistung. Garantie auf den ersetzten Akku: 3 Monate.'
      }
    }[type];

    if(!content) return;
    modal.querySelector('[data-modal-title]').textContent = content.title;
    modal.querySelector('[data-modal-body]').textContent = content.body;
    modal.classList.add('open');
  }

  function renderSummary(){
    priceSummary.innerHTML = `
      <div class="stat-card premium-card">
        <strong>${window.REPAIR_DATA.brands.reduce((sum, b) => sum + b.models.length, 0)} Modelle</strong>
        <span>Apple, Samsung, FE, Pro, Max, Mini, Ultra und mehr</span>
      </div>
      <div class="stat-card premium-card">
        <strong>${window.REPAIR_DATA.cleaningPrice} €</strong>
        <span>Handy-Reinigung für Lautsprecher, Mikrofon und Ladebuchse</span>
      </div>
      <div class="stat-card premium-card">
        <strong>${window.REPAIR_DATA.insuranceFee} €</strong>
        <span>Kostenvoranschlag / Erstellungsgebühr für Versicherungsfälle</span>
      </div>
    `;
  }

  function render(){
    renderTabs();
    renderSummary();
    renderModels();
  }

  searchInput?.addEventListener('input', () => {
    state.search = searchInput.value;
    renderModels();
  });

  modal?.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => modal.classList.remove('open'));
  });
  modal?.addEventListener('click', (e) => {
    if(e.target === modal) modal.classList.remove('open');
  });

  render();
}

document.addEventListener('DOMContentLoaded', () => {
  initCookieBanner();
  initLoadButtons();
  initMobileNav();
  initReveal();
  initMagneticButtons();
  initFloatingActions();
  initPriceConfigurator();
});