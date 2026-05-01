/**
 * GoseriMart SPA Router & App Initialization
 */
const App = {
  routes: {
    '/': () => HomePage.render(),
    '/products': () => ProductsPage.render(),
    '/cart': () => CartPage.render(),
    '/checkout': () => CheckoutPage.render(),
    '/profile': () => ProfilePage.render(),
    '/orders': () => OrdersPage.render(),
  },

  init() {
    window.addEventListener('hashchange', () => this.navigate());
    window.addEventListener('load', () => this.navigate());
    if (!location.hash) location.hash = '#/';
  },

  async navigate() {
    const hash = location.hash.slice(1) || '/';
    const path = hash.split('?')[0];

    // Show loader
    const content = document.getElementById('page-content');
    content.innerHTML = `
      <div class="page-loader">
        <div class="loader-spinner"></div>
        <p>Loading...</p>
      </div>
    `;

    // Update header
    await Header.render();

    // Route to page
    const route = this.routes[path];
    if (route) {
      try {
        await route();
      } catch (err) {
        console.error('Page error:', err);
        content.innerHTML = `
          <div class="empty-state">
            <span class="empty-icon">⚠️</span>
            <h2>Something went wrong</h2>
            <p>${err.message}</p>
            <a href="#/" class="btn btn-primary" data-link>Go Home</a>
          </div>`;
      }
    } else {
      content.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🔍</span>
          <h2>Page not found</h2>
          <p>The page you're looking for doesn't exist.</p>
          <a href="#/" class="btn btn-primary" data-link>Go Home</a>
        </div>`;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

App.init();
