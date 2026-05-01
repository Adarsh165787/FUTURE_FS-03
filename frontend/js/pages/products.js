/**
 * Products page — filter sidebar + search + product grid
 */
const ProductsPage = {
  currentCategory: null,
  currentSearch: '',
  allProducts: [],
  cartItems: [],

  async render() {
    const content = document.getElementById('page-content');
    
    // Parse URL params
    const params = new URLSearchParams(location.hash.split('?')[1] || '');
    this.currentCategory = params.get('category') || null;
    this.currentSearch = params.get('search') || '';

    // Fetch data
    const [catRes, prodRes, cartRes] = await Promise.all([
      API.getCategories(),
      API.getProducts(),
      API.getCart().catch(() => ({ data: { items: [] } }))
    ]);

    const categories = catRes.data;
    this.allProducts = prodRes.data;
    this.cartItems = (cartRes.data.items || []).map(i => ({ productId: i.productId || i.product?.id, quantity: i.quantity }));

    // Filter products
    let filtered = [...this.allProducts];
    if (this.currentCategory) {
      filtered = filtered.filter(p => p.category === this.currentCategory);
    }
    if (this.currentSearch) {
      const q = this.currentSearch.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    content.innerHTML = `
      <div class="page-enter">
        <section class="section" style="padding-top:32px">
          <div class="search-bar">
            <div class="search-input-wrap">
              <span class="search-icon">🔍</span>
              <input type="text" class="search-input" id="product-search"
                placeholder="Search groceries..."
                value="${this.currentSearch}">
            </div>
          </div>

          <div class="products-layout">
            <!-- Sidebar -->
            <aside class="filter-sidebar">
              <div class="glass-card">
                <h3 class="filter-title">Categories</h3>
                <div class="filter-list">
                  <div class="filter-item ${!this.currentCategory ? 'active' : ''}"
                    onclick="ProductsPage.filterCategory(null)">
                    <span>All Products</span>
                    <span class="filter-count">${this.allProducts.length}</span>
                  </div>
                  ${categories.map(cat => `
                    <div class="filter-item ${this.currentCategory === cat.name ? 'active' : ''}"
                      onclick="ProductsPage.filterCategory('${cat.name}')">
                      <span>${cat.icon} ${cat.name}</span>
                      <span class="filter-count">${cat.count}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </aside>

            <!-- Grid -->
            <div>
              <p style="color:var(--text-muted);margin-bottom:16px;font-size:14px">
                Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}
                ${this.currentCategory ? ` in <strong style="color:var(--accent);text-transform:capitalize">${this.currentCategory}</strong>` : ''}
              </p>
              <div class="products-grid" id="products-grid">
                ${filtered.length > 0
                  ? filtered.map(p => ProductCard.render(p, this.cartItems)).join('')
                  : `<div class="empty-state" style="grid-column:1/-1">
                       <span class="empty-icon">🔍</span>
                       <h2>No products found</h2>
                       <p>Try a different search or category</p>
                     </div>`
                }
              </div>
            </div>
          </div>
        </section>
      </div>
    `;

    // Search listener
    const searchInput = document.getElementById('product-search');
    let debounce;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        this.currentSearch = e.target.value;
        const cat = this.currentCategory ? `category=${this.currentCategory}&` : '';
        const search = e.target.value ? `search=${e.target.value}` : '';
        location.hash = `/products${cat || search ? '?' + cat + search : ''}`;
      }, 350);
    });
  },

  filterCategory(cat) {
    const search = this.currentSearch ? `&search=${this.currentSearch}` : '';
    location.hash = cat ? `/products?category=${cat}${search}` : `/products${search ? '?' + search : ''}`;
  },

  async refreshCard(productId) {
    const cartRes = await API.getCart().catch(() => ({ data: { items: [] } }));
    this.cartItems = (cartRes.data.items || []).map(i => ({ productId: i.productId || i.product?.id, quantity: i.quantity }));
    const product = this.allProducts.find(p => p.id === productId);
    if (!product) return;
    const cardEl = document.getElementById(`product-${productId}`);
    if (!cardEl) return;
    const temp = document.createElement('div');
    temp.innerHTML = ProductCard.render(product, this.cartItems);
    cardEl.replaceWith(temp.firstElementChild);
  }
};
