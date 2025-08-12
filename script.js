// ——— Utilities ———
function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

// Mobile Nav
document.addEventListener('DOMContentLoaded', () => {
  const toggle = $('.nav-toggle');
  const menu = $('#navmenu');
  if(toggle && menu){
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
});

// Footer year
const yEl = document.getElementById('year');
if (yEl) yEl.textContent = new Date().getFullYear();

// ——— Carousel (nur auf Startseite vorhanden) ———
(function(){
  const track = document.getElementById('carouselTrack');
  const container = document.querySelector('.carousel-container');
  if(!track || !container) return; // nicht vorhanden → überspringen

  let current = 0;
  const slides = $all('.carousel-slide', track);
  const indicators = $all('#indicators .indicator');

  function update(){
    track.style.transform = `translateX(-${current * 100}%)`;
    indicators.forEach((dot,i)=> dot.classList.toggle('active', i===current));
  }
  function move(dir){ current = (current + dir + slides.length) % slides.length; update(); }
  update();

  // Buttons
  $all('.carousel-btn').forEach(btn => btn.addEventListener('click', () => move(parseInt(btn.dataset.dir,10))));
  // Dots
  indicators.forEach(dot => dot.addEventListener('click', () => { current = parseInt(dot.dataset.go,10); update(); }));

  // Auto-play
  let timer = setInterval(()=>move(1), 5000);
  container.addEventListener('mouseenter', ()=> clearInterval(timer));
  container.addEventListener('mouseleave', ()=> timer = setInterval(()=>move(1), 5000));

  // Swipe
  let sx=0, ex=0;
  container.addEventListener('touchstart', e=> sx = e.changedTouches[0].screenX);
  container.addEventListener('touchend', e=> { ex = e.changedTouches[0].screenX; if(ex < sx-50) move(1); if(ex > sx+50) move(-1); });
})();

// ——— Preisfinder (nur auf preise.html) ———
(function(){
  const brandSel = document.getElementById('brandSelect');
  const modelSel = document.getElementById('modelSelect');
  const servSel  = document.getElementById('serviceSelect');
  const priceCard = document.getElementById('priceCard');
  const priceValue = document.getElementById('priceValue');
  const selTitle = document.getElementById('selTitle');
  const selHint = document.getElementById('selHint');
  const table = document.getElementById('priceTable');
  const waBtn = document.getElementById('waButton');

  if(!brandSel || !table) return; // Seite ist nicht die Preisseite

  // 1) Marke laden
  const brands = Object.keys(PRICE_DB).sort();
  brands.forEach(b => brandSel.append(new Option(b, b)));

  brandSel.addEventListener('change', () => {
    modelSel.innerHTML = '<option value="">– bitte wählen –</option>';
    servSel.innerHTML = '<option value="">– bitte wählen –</option>';
    modelSel.disabled = !brandSel.value;
    servSel.disabled = true;
    priceCard.hidden = true; waBtn.hidden = true;

    if(!brandSel.value) return;
    const models = Object.keys(PRICE_DB[brandSel.value]).sort();
    models.forEach(m => modelSel.append(new Option(m, m)));
  });

  // 2) Modell laden
  modelSel.addEventListener('change', () => {
    servSel.innerHTML = '<option value="">– bitte wählen –</option>';
    servSel.disabled = !modelSel.value;
    priceCard.hidden = true; waBtn.hidden = true;

    if(!modelSel.value) return;

    // Tabelle aufbauen
    const map = PRICE_DB[brandSel.value][modelSel.value];
    buildTable(map);

    // Services befüllen
    Object.keys(map).forEach(s => servSel.append(new Option(s, s)));
  });

  // 3) Service → Preis anzeigen
  servSel.addEventListener('change', () => {
    if(!servSel.value) { priceCard.hidden = true; waBtn.hidden = true; return; }
    const price = PRICE_DB[brandSel.value][modelSel.value][servSel.value];
    selTitle.textContent = `${brandSel.value} · ${modelSel.value} · ${servSel.value}`;
    if(price === null || typeof price === 'undefined'){
      priceValue.textContent = 'auf Anfrage';
      selHint.textContent = 'Schreib mir kurz – ich nenne dir einen Preis.';
    } else {
      priceValue.textContent = `ab ${price.toFixed(0)} €`;
      selHint.textContent = 'Preis je nach Zustand/Variante – inkl. Teile & Arbeit.';
    }
    priceCard.hidden = false;

    // WhatsApp Nachricht vorbereiten
    const msg = encodeURIComponent(`Anfrage: ${brandSel.value} / ${modelSel.value} / ${servSel.value} – Preis?`);
    waBtn.href = `https://wa.me/491601845755?text=${msg}`;
    waBtn.hidden = false;
  });

  function buildTable(map){
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    Object.entries(map).forEach(([service, price]) => {
      const tr = document.createElement('tr');
      const tdS = document.createElement('td');
      const tdP = document.createElement('td');
      tdS.textContent = service;
      tdP.textContent = (price===null || typeof price === 'undefined') ? 'auf Anfrage' : `ab ${price} €`;
      tr.append(tdS, tdP);
      tbody.append(tr);
    });
  }
})();