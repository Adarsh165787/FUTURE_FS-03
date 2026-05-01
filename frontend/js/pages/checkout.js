/**
 * Checkout page — requires auth, auto-fills user info
 */
const CheckoutPage = {
  async render() {
    const content = document.getElementById('page-content');

    // Check auth — if not logged in, show modal then redirect back
    if (!Auth.isLoggedIn()) {
      AuthModal.open(() => { location.hash = '#/checkout'; });
      content.innerHTML = `
        <div class="page-enter"><section class="section">
          <div class="empty-state">
            <span class="empty-icon">🔒</span>
            <h2>Login to complete your order</h2>
            <p>Please sign in or create an account to place your order.</p>
            <button class="btn btn-primary" onclick="AuthModal.open(() => { location.hash='#/checkout'; })">
              Login / Sign Up
            </button>
          </div>
        </section></div>`;
      return;
    }

    let cartData;
    try {
      const res = await API.getCart();
      cartData = res.data;
    } catch (e) {
      cartData = { items: [], total: 0, totalItems: 0 };
    }

    if (!cartData.items || cartData.items.length === 0) {
      content.innerHTML = `
        <div class="page-enter"><section class="section">
          <div class="empty-state">
            <span class="empty-icon">📦</span>
            <h2>Nothing to checkout</h2>
            <p>Add some items to your cart first.</p>
            <a href="#/products" class="btn btn-primary" data-link>Browse Products</a>
          </div>
        </section></div>`;
      return;
    }

    // Get fresh user data
    const user = Auth.getUser() || {};

    content.innerHTML = `
      <div class="page-enter">
        <section class="section" style="padding-top:32px">
          <div class="section-header">
            <div>
              <h2 class="section-title">Checkout</h2>
              <p class="section-subtitle">Complete your order, ${user.name || ''}</p>
            </div>
          </div>
          <div class="checkout-layout">
            <div class="checkout-form">
              <div class="glass-card">
                <h3 class="form-title">Delivery Address</h3>
                <form id="checkout-form" onsubmit="CheckoutPage.placeOrder(event)">
                  <div class="checkout-user-info">
                    <div class="checkout-user-row">
                      <span class="checkout-label">Name:</span>
                      <span class="checkout-value">${user.name || '—'}</span>
                    </div>
                    <div class="checkout-user-row">
                      <span class="checkout-label">Phone:</span>
                      <span class="checkout-value">${user.phone || '—'}</span>
                    </div>
                    <a href="#/profile" class="btn btn-secondary btn-sm" style="margin-top:8px" data-link>Edit Profile</a>
                  </div>
                  <div class="form-group" id="fg-address" style="margin-top:20px">
                    <label for="cust-address">Delivery Address</label>
                    <textarea id="cust-address" placeholder="123 Main St, Apartment 4B, City" required>${user.address || ''}</textarea>
                    <span class="error-text">Please enter a delivery address</span>
                  </div>
                  <button type="submit" class="btn btn-primary" style="width:100%;margin-top:8px" id="place-order-btn">
                    Place Order — ₹${cartData.total.toFixed(2)}
                  </button>
                </form>
              </div>
            </div>
            <div class="order-summary">
              <div class="glass-card">
                <h3 class="summary-title">Your Order</h3>
                <div class="order-items-mini">
                  ${cartData.items.map(item => `
                    <div class="order-item-mini">
                      <span class="item-emoji">${item.product.image}</span>
                      <span class="item-name">${item.product.name}</span>
                      <span class="item-qty">×${item.quantity}</span>
                      <span class="item-total">₹${item.lineTotal.toFixed(2)}</span>
                    </div>
                  `).join('')}
                </div>
                <div class="summary-row total">
                  <span>Total</span>
                  <span>₹${cartData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  async placeOrder(e) {
    e.preventDefault();
    const address = document.getElementById('cust-address').value.trim();
    const fg = document.getElementById('fg-address');

    if (!address) {
      fg.classList.add('has-error');
      return;
    }
    fg.classList.remove('has-error');

    const btn = document.getElementById('place-order-btn');
    btn.textContent = 'Placing order...';
    btn.disabled = true;

    try {
      const res = await API.placeOrder({ address });
      Header.updateBadge();
      this.showSuccess(res.data);
    } catch (err) {
      Toast.error(err.message);
      btn.textContent = 'Place Order';
      btn.disabled = false;
    }
  },

  showSuccess(order) {
    const content = document.getElementById('page-content');
    content.innerHTML = `
      <div class="page-enter">
        <div class="confetti-container" id="confetti"></div>
        <div class="success-container">
          <div class="success-icon">🎉</div>
          <h1>Order Placed!</h1>
          <div class="order-id">Order #${order.id}</div>
          <p>Thank you, ${order.customerName}! Your groceries will be delivered soon.</p>
          <div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap;justify-content:center">
            <a href="#/orders" class="btn btn-secondary" data-link>View Orders</a>
            <a href="#/products" class="btn btn-primary" data-link>Continue Shopping</a>
          </div>
        </div>
      </div>
    `;
    this.launchConfetti();
  },

  launchConfetti() {
    const container = document.getElementById('confetti');
    if (!container) return;
    const colors = ['#00d474', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7', '#ec4899'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 2 + 's';
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';
      piece.style.width = (6 + Math.random() * 8) + 'px';
      piece.style.height = (6 + Math.random() * 8) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);
    }
    setTimeout(() => container.remove(), 5000);
  }
};
