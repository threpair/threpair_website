const yearEl=document.getElementById('year');
if(yearEl){yearEl.textContent=new Date().getFullYear();}

// Mobile Navigation
const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
if(menuToggle&&nav){menuToggle.addEventListener('click',()=>nav.classList.toggle('open'));}

// Reveal Animation
const io=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Produkte rendern
if(typeof PRODUCTS!== 'undefined' && document.getElementById('product-list')){
  const list=document.getElementById('product-list');
  PRODUCTS.forEach(p=>{
    const div=document.createElement('div');
    div.className='product';
    div.innerHTML=`<div class="media"><img src="${p.img}" alt="${p.title}"></div>
      <div class="body"><h3>${p.title}</h3><p>${p.price?`ab ${p.price} €`:'auf Anfrage'}</p>
      <a class="btn btn-primary" target="_blank" href="https://wa.me/491601845755?text=Ich interessiere mich für: ${encodeURIComponent(p.title)}">Anfragen</a></div>`;
    list.appendChild(div);
  });
}

// Preisliste interaktiv
if(typeof PRICE_DATA !== 'undefined' && document.getElementById('brandSelect')){
  const brandSelect=document.getElementById('brandSelect');
  const modelSelect=document.getElementById('modelSelect');
  const serviceSelect=document.getElementById('serviceSelect');
  const priceCard=document.getElementById('priceCard');
  const selTitle=document.getElementById('selTitle');
  const selHint=document.getElementById('selHint');
  const priceValue=document.getElementById('priceValue');
  const waButton=document.getElementById('waButton');
  const priceTableBody=document.querySelector('#priceTable tbody');

  Object.keys(PRICE_DATA).forEach(brand=>{
    const opt=document.createElement('option');
    opt.value=brand;
    opt.textContent=brand;
    brandSelect.appendChild(opt);
  });

  brandSelect.addEventListener('change',()=>{
    const brand=brandSelect.value;
    modelSelect.innerHTML='<option value="">– bitte wählen –</option>';
    serviceSelect.innerHTML='<option value="">– zuerst Modell wählen –</option>';
    modelSelect.disabled=!brand;
    serviceSelect.disabled=true;
    priceCard.hidden=true;
    waButton.hidden=true;
    priceTableBody.innerHTML='';
    if(!brand)return;
    Object.keys(PRICE_DATA[brand]).forEach(model=>{
      const opt=document.createElement('option');
      opt.value=model;
      opt.textContent=model;
      modelSelect.appendChild(opt);
    });
  });

  modelSelect.addEventListener('change',()=>{
    const brand=brandSelect.value;
    const model=modelSelect.value;
    serviceSelect.innerHTML='<option value="">– bitte wählen –</option>';
    serviceSelect.disabled=!model;
    priceCard.hidden=true;
    waButton.hidden=true;
    priceTableBody.innerHTML='';
    if(!model)return;
    const services=PRICE_DATA[brand][model];
    Object.entries(services).forEach(([service,price])=>{
      const opt=document.createElement('option');
      opt.value=service;
      opt.textContent=service;
      serviceSelect.appendChild(opt);

      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${service}</td><td>${price? 'ab '+price+' €':'auf Anfrage'}</td>`;
      priceTableBody.appendChild(tr);
    });
  });

  serviceSelect.addEventListener('change',()=>{
    const brand=brandSelect.value;
    const model=modelSelect.value;
    const service=serviceSelect.value;
    if(!service){priceCard.hidden=true;waButton.hidden=true;return;}
    const price=PRICE_DATA[brand][model][service];
    selTitle.textContent=`${model} – ${service}`;
    selHint.textContent=price? '' : 'Preisangabe folgt.';
    priceValue.textContent=price? `ab ${price} €` : 'auf Anfrage';
    waButton.href=`https://wa.me/491601845755?text=${encodeURIComponent('Ich interessiere mich für: '+model+' – '+service)}`;
    waButton.hidden=false;
    priceCard.hidden=false;
  });
}
