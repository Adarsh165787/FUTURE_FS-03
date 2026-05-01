/**
 * Home page — hero + categories + featured products
 */
const HomePage = {
  async render() {
    const content = document.getElementById('page-content');

    // Fetch data in parallel
    const [catRes, prodRes, cartRes] = await Promise.all([
      API.getCategories(),
      API.getProducts(),
      API.getCart().catch(() => ({ data: { items: [] } }))
    ]);

    const categories = catRes.data;
    const products = prodRes.data;
    const cartItems = cartRes.data.items || [];
    const featured = products.filter(p => p.discount > 0).slice(0, 4);

    content.innerHTML = `
      <div class="page-enter">
        <!-- Hero -->
        <section class="hero">
          <div class="hero-inner">
            <div class="hero-content">
              <div class="hero-badge">🌿 Fresh & Organic</div>
              <h1>Grocery shopping<br>made <span class="highlight">effortless</span></h1>
              <p>Browse hundreds of fresh products, add them to your cart, and get them delivered — all from the comfort of your home.</p>
              <div class="hero-actions">
                <a href="#/products" class="btn btn-primary" data-link>Shop Now →</a>
                <a href="#/products" class="btn btn-secondary" data-link>Browse Categories</a>
              </div>
            </div>
          </div>
        </section>

        <!-- Categories -->
        <section class="section">
          <div class="section-header">
            <div>
              <h2 class="section-title">Shop by Category</h2>
              <p class="section-subtitle">Find exactly what you need</p>
            </div>
          </div>
          <div class="categories-grid">
            ${categories.map(cat => `
              <a href="#/products?category=${cat.name}" class="category-card glass-card" data-link>
                <span class="cat-icon">${cat.icon}</span>
                <span class="cat-name">${cat.name}</span>
                <span class="cat-count">${cat.count} items</span>
              </a>
            `).join('')}
          </div>
        </section>

        <!-- Featured / On Sale -->
        ${featured.length > 0 ? `
        <section class="section">
          <div class="section-header">
            <div>
              <h2 class="section-title">🔥 Hot Deals</h2>
              <p class="section-subtitle">Don't miss these discounted items</p>
            </div>
            <a href="#/products" class="btn btn-secondary btn-sm" data-link>View All</a>
          </div>
          <div class="featured-row">
            ${featured.map(p => ProductCard.render(p, cartItems)).join('')}
          </div>
        </section>
        ` : ''}
      </div>
    `;
  }
};
