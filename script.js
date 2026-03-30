document.addEventListener('DOMContentLoaded', () => {
  const brand = document.getElementById('brandSelect');
  const search = document.getElementById('modelSearch');
  const model = document.getElementById('modelSelect');
  const result = document.getElementById('priceResult');
  const modal = document.getElementById('infoModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalClose = document.getElementById('modalClose');

  document.querySelectorAll('.header .container').forEach(headerContainer => {
    const nav = headerContainer.querySelector('.nav');
    if (!nav) return;

    let toggleBtn = headerContainer.querySelector('.nav-toggle');
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'nav-toggle';
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = 'Menü';
      nav.before(toggleBtn);
    }

    toggleBtn.addEventListener('click', () => {
      const open = headerContainer.classList.toggle('nav-open');
      toggleBtn.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      headerContainer.classList.remove('nav-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }));
  });
  if (brand && model && result && typeof PRICE_DATA !== 'undefined') {
    const money = v => typeof v === 'number' ? `${v} €` : v;
    const infoButton = key => `<button class="link-info" type="button" data-info="${key}">Hinweis</button>`;
    const fillBrands = () => brand.innerHTML = Object.keys(PRICE_DATA).map(n => `<option value="${n}">${n}</option>`).join('');
    const currentModels = () => {
      const models = Object.keys(PRICE_DATA[brand.value] || {});
      const q = (search?.value || '').toLowerCase().trim();
      return models.filter(m => m.toLowerCase().includes(q));
    };
    function bindInfoButtons(){
      document.querySelectorAll('[data-info]').forEach(btn => btn.addEventListener('click', () => {
        const data = PART_INFO[btn.dataset.info];
        if (!data || !modal) return;
        modalTitle.textContent = data.title;
        modalText.textContent = data.text;
        modal.classList.add('open');
      }));
    }
    function render(){
      const dataset = (PRICE_DATA[brand.value] || {})[model.value];
      if (!dataset) {
        result.innerHTML = `<div class="card"><h2>Kein Modell gefunden</h2><p>Anderes Modell? Schreib uns per WhatsApp.</p></div>`;
        return;
      }
      const rows = Object.entries(dataset).map(([repair, values]) => {
        const originalInfo = repair === 'display' ? infoButton('display_original') : repair === 'battery' ? infoButton('battery_original') : '';
        const copyInfo = repair === 'display' ? infoButton('display_copy') : repair === 'battery' ? infoButton('battery_copy') : '';
        const originalWarranty = repair === 'battery' ? 'Garantie 3 Monate' : 'Garantie 12 Monate';
        const copyWarranty = repair === 'battery' ? 'Garantie 3 Monate' : 'Garantie 6 Monate';
        const copyLabel = repair === 'display' ? 'Soft OLED / hochwertiger Nachbau' : repair === 'battery' ? 'Nachbau / TI-Chip' : 'Hochwertiger Nachbau';
        return `<div class="price-card">
          <span class="badge">${REPAIR_LABELS[repair] || repair}</span>
          <div class="price-row"><div><strong>Original</strong><br><span class="small">${originalWarranty}</span><br>${originalInfo}</div><div class="price-tag">${money(values.original)}</div></div>
          <div class="price-row"><div><strong>${copyLabel}</strong><br><span class="small">${copyWarranty}</span><br>${copyInfo}</div><div class="price-tag">${money(values.copy)}</div></div>
        </div>`;
      }).join('');
      result.innerHTML = `<div class="card"><div class="result-head"><div><h2>${model.value}</h2><p class="section-text">Alle Preise inkl. Einbau. Anderes Modell? <strong>Auf Anfrage.</strong></p></div><a class="btn btn-primary" href="https://wa.me/4925649392860?text=Hallo%20TH%20Repair,%20ich%20interessiere%20mich%20für%20eine%20Reparatur%20am%20${encodeURIComponent(model.value)}">Preis per WhatsApp anfragen</a></div><div class="result-grid">${rows}</div></div>`;
      bindInfoButtons();
    }
    function fillModels(){
      const models = currentModels();
      model.innerHTML = models.length ? models.map(m => `<option value="${m}">${m}</option>`).join('') : '<option value="">Kein Modell gefunden</option>';
      render();
    }
    fillBrands(); fillModels();
    brand.addEventListener('change', fillModels);
    model.addEventListener('change', render);
    search?.addEventListener('input', fillModels);
  }

  const trackerForm = document.getElementById('trackerForm');
  const trackingCode = document.getElementById('trackingCode');
  const trackerTitle = document.getElementById('trackerTitle');
  const trackerSummary = document.getElementById('trackerSummary');
  const trackerProgress = document.getElementById('trackerProgress');
  const trackerTimestamp = document.getElementById('trackerTimestamp');

  if (trackerForm && trackingCode && trackerTitle && trackerSummary && trackerProgress && trackerTimestamp) {
    const steps = [
      'Auftrag eingegangen',
      'Gerät in Diagnose',
      'Ersatzteil verfügbar',
      'Reparatur läuft',
      'Qualitätscheck',
      'Abholbereit'
    ];

    const codeHash = value => [...value].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

    function renderTracker(code) {
      const cleanCode = code.trim().toUpperCase();
      if (!cleanCode) return;
      const now = new Date();
      const tick = Math.floor(now.getTime() / 15000);
      const activeIndex = (codeHash(cleanCode) + tick) % steps.length;

      trackerTitle.textContent = `Auftrag ${cleanCode}`;
      trackerSummary.textContent = `Aktueller Schritt: ${steps[activeIndex]}`;
      trackerTimestamp.textContent = `Letztes Live-Update: ${now.toLocaleString('de-DE')}`;

      trackerProgress.innerHTML = steps.map((step, index) => {
        const state = index < activeIndex ? 'done' : index === activeIndex ? 'active' : 'todo';
        const label = state === 'done' ? 'Erledigt' : state === 'active' ? 'Läuft' : 'Offen';
        return `<div class="tracker-step ${state}"><span class="tracker-dot"></span><div><strong>${step}</strong><p class="small">${label}</p></div></div>`;
      }).join('');
    }

    trackerForm.addEventListener('submit', e => {
      e.preventDefault();
      renderTracker(trackingCode.value);
    });

    const fromHash = decodeURIComponent((location.hash || '').replace('#', ''));
    if (fromHash) {
      trackingCode.value = fromHash;
      renderTracker(fromHash);
    }

    setInterval(() => {
      if (trackingCode.value.trim()) renderTracker(trackingCode.value);
    }, 10000);
  }

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
  }
});
