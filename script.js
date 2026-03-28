document.addEventListener('DOMContentLoaded', () => {
  const brand = document.getElementById('brandSelect');
  const search = document.getElementById('modelSearch');
  const model = document.getElementById('modelSelect');
  const result = document.getElementById('priceResult');
  const modal = document.getElementById('infoModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');

  if (brand && model && result) {
    function fillBrands() {
      brand.innerHTML = Object.keys(PRICE_DATA).map(name => `<option value="${name}">${name}</option>`).join('');
    }

    function currentModels() {
      const models = Object.keys(PRICE_DATA[brand.value] || {});
      const q = (search.value || '').toLowerCase().trim();
      return models.filter(m => m.toLowerCase().includes(q));
    }

    function fillModels() {
      const models = currentModels();
      model.innerHTML = models.length
        ? models.map(name => `<option value="${name}">${name}</option>`).join('')
        : '<option value="">Kein Modell gefunden</option>';
      render();
    }

    function money(v){ return typeof v === 'number' ? `${v} €` : v; }

    function infoButton(key) {
      return `<button class="link-info" type="button" data-info="${key}">Hinweis</button>`;
    }

    function render() {
      const modelName = model.value;
      const dataset = (PRICE_DATA[brand.value] || {})[modelName];
      if (!dataset) {
        result.innerHTML = `<div class="card"><h2>Kein Modell gefunden</h2><p>Anderes Modell? Schreib uns einfach per WhatsApp.</p></div>`;
        return;
      }
      const rows = Object.entries(dataset).map(([repair, values]) => {
        const repairLabel = REPAIR_LABELS[repair] || repair;
        const originalInfo = repair === 'display' ? infoButton('display_original') : (repair === 'battery' ? infoButton('battery_original') : '');
        const copyInfo = repair === 'display' ? infoButton('display_copy') : (repair === 'battery' ? infoButton('battery_copy') : '');
        return `
          <div class="price-card">
            <div class="inline-info"><span class="badge">${repairLabel}</span></div>
            <div class="price-row">
              <div>
                <strong>Original</strong><br>
                <span class="small">${repair === 'battery' ? 'Garantie 3 Monate' : 'Garantie 12 Monate'}</span><br>
                ${originalInfo}
              </div>
              <div class="price-tag">${money(values.original)}</div>
            </div>
            <div class="price-row">
              <div>
                <strong>${repair === 'display' ? 'Soft OLED / hochwertiger Nachbau' : repair === 'battery' ? 'Nachbau / TI-Chip' : 'Hochwertiger Nachbau'}</strong><br>
                <span class="small">${repair === 'battery' ? 'Garantie 3 Monate' : 'Garantie 6 Monate'}</span><br>
                ${copyInfo}
              </div>
              <div class="price-tag">${money(values.copy)}</div>
            </div>
          </div>`;
      }).join('');

      result.innerHTML = `
        <div class="card">
          <div class="result-head">
            <div>
              <h2>${modelName}</h2>
              <p class="section-text">Alle Preise inkl. Einbau. Anderes Modell? <strong>Auf Anfrage.</strong></p>
            </div>
            <a class="btn btn-primary" href="https://wa.me/4925649392860?text=Hallo%20TH%20Repair,%20ich%20interessiere%20mich%20f%C3%BCr%20eine%20Reparatur%20am%20${encodeURIComponent(modelName)}">Preis per WhatsApp anfragen</a>
          </div>
          <div class="result-grid">${rows}</div>
        </div>`;
      bindInfoButtons();
    }

    function bindInfoButtons() {
      document.querySelectorAll('[data-info]').forEach(btn => {
        btn.addEventListener('click', () => {
          const data = PART_INFO[btn.dataset.info];
          if (!data) return;
          modalTitle.textContent = data.title;
          modalText.textContent = data.text;
          modal.classList.add('open');
        });
      });
    }

    document.getElementById('modalClose')?.addEventListener('click', () => modal.classList.remove('open'));
    modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

    fillBrands();
    fillModels();
    brand.addEventListener('change', fillModels);
    model.addEventListener('change', render);
    search.addEventListener('input', fillModels);
  }
});
