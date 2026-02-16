(function () {
  const page = document.querySelector('.product-page');
  if (!page) return;

  const category = page.dataset.category;
  const list = document.getElementById('productList');
  const info = document.getElementById('resultsInfo');
  const searchInput = document.getElementById('searchInput');
  const networkFilter = document.getElementById('networkFilter');
  const maxPriceFilter = document.getElementById('maxPriceFilter');

  let allProducts = [];

  function euro(value) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  }

  function createProductCard(product) {
    const article = document.createElement('article');
    article.className = 'product-card';

    article.innerHTML = `
      <span class="product-category">${product.category}</span>
      <h2 class="product-title">${product.name}</h2>
      <p class="product-description">${product.description}</p>
      <ul class="product-meta">
        <li><strong>Netz:</strong> ${product.network}</li>
        <li><strong>Preis:</strong> ${euro(product.price)} / Monat</li>
      </ul>
      <a class="cta-button" href="${product.cta || 'kontakt.html'}">Jetzt anfragen</a>
    `;

    return article;
  }

  function render(products) {
    list.innerHTML = '';

    if (!products.length) {
      info.textContent = 'Keine Treffer gefunden. Passe die Filter an.';
      return;
    }

    info.textContent = `${products.length} Angebot(e) gefunden.`;
    products.forEach((product) => list.appendChild(createProductCard(product)));
  }

  function applyFilters() {
    const searchTerm = (searchInput?.value || '').trim().toLowerCase();
    const network = networkFilter?.value || '';
    const maxPrice = Number(maxPriceFilter?.value || 0);

    const filtered = allProducts.filter((product) => {
      const text = `${product.name} ${product.description} ${product.network}`.toLowerCase();
      const matchesSearch = !searchTerm || text.includes(searchTerm);
      const matchesNetwork = !network || product.network === network;
      const matchesPrice = !maxPrice || product.price <= maxPrice;
      return matchesSearch && matchesNetwork && matchesPrice;
    });

    render(filtered);
  }

  function populateNetworks(products) {
    const uniqueNetworks = [...new Set(products.map((product) => product.network))];
    uniqueNetworks.forEach((network) => {
      const option = document.createElement('option');
      option.value = network;
      option.textContent = network;
      networkFilter.appendChild(option);
    });
  }

  async function init() {
    try {
      const response = await fetch('products.json');
      const products = await response.json();
      allProducts = products.filter((product) => !category || product.category === category);
      populateNetworks(allProducts);
      render(allProducts);
    } catch (error) {
      info.textContent = 'Produkte konnten nicht geladen werden.';
      console.error('Fehler beim Laden der Produkte:', error);
    }
  }

  searchInput?.addEventListener('input', applyFilters);
  networkFilter?.addEventListener('change', applyFilters);
  maxPriceFilter?.addEventListener('input', applyFilters);

  init();
})();
