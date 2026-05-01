/**
 * GoseriMart API Client
 * Fetch wrapper for all backend endpoints
 */
const API = {
  base: '/api',

  async request(endpoint, options = {}) {
    const url = `${this.base}${endpoint}`;
    const headers = { 'Content-Type': 'application/json' };

    // Inject auth token if available
    const token = Auth.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { headers, ...options };
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }
    const res = await fetch(url, config);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Request failed');
    return data;
  },

  // Auth
  signup(name, email, password, phone) {
    return this.request('/auth/signup', { method: 'POST', body: { name, email, password, phone } });
  },
  login(email, password) {
    return this.request('/auth/login', { method: 'POST', body: { email, password } });
  },
  getMe() { return this.request('/auth/me'); },
  updateProfile(data) {
    return this.request('/auth/me', { method: 'PUT', body: data });
  },

  // Products
  getProducts(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/products${qs ? '?' + qs : ''}`);
  },
  getProduct(id) { return this.request(`/products/${id}`); },
  getCategories() { return this.request('/products/categories'); },

  // Cart
  getCart() { return this.request('/cart'); },
  addToCart(productId, quantity = 1) {
    return this.request('/cart/add', { method: 'POST', body: { productId, quantity } });
  },
  updateCartItem(productId, quantity) {
    return this.request('/cart/update', { method: 'PUT', body: { productId, quantity } });
  },
  removeFromCart(productId) {
    return this.request(`/cart/remove/${productId}`, { method: 'DELETE' });
  },
  clearCart() { return this.request('/cart/clear', { method: 'DELETE' }); },

  // Orders
  placeOrder(orderData) {
    return this.request('/orders', { method: 'POST', body: orderData });
  },
  getOrders() { return this.request('/orders'); },
  getOrder(id) { return this.request(`/orders/${id}`); }
};
