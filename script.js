// Mobile Navigation ein/aus
const toggle = document.querySelector('.nav-toggle');
const menu   = document.getElementById('navmenu');
if (toggle && menu){
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Footer-Jahr
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Scroll-Reveal (sanft & professionell)
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
},{threshold: .15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
