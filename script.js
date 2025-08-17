document.getElementById("year").textContent=new Date().getFullYear();
// Reveal Animation
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");io.unobserve(e.target);}})});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
// Produkte rendern
if(typeof PRODUCTS!=="undefined"){
  const list=document.getElementById("product-list");
  PRODUCTS.forEach(p=>{
    const div=document.createElement("div");
    div.className="product";
    div.innerHTML=`<div class="media"><img src="${p.img}" alt="${p.title}"></div>
      <div class="body"><h3>${p.title}</h3><p>${p.price?`ab ${p.price} €`:"auf Anfrage"}</p>
      <a class="btn btn-primary" target="_blank" href="https://wa.me/491601845755?text=Ich interessiere mich für: ${encodeURIComponent(p.title)}">Anfragen</a></div>`;
    list.appendChild(div);
  });
}