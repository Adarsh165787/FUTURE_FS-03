/**
 * Cart page — item list + summary sidebar
 */
const CartPage = {
  async render() {
    const content = document.getElementById('page-content');
    let cartData;
    try {
      const res = await API.getCart();
      cartData = res.data;
    } catch (e) {
      cartData = { items: [], subtotal: 0, total: 0, totalItems: 0 };
    }

    if (!cartData.items || cartData.items.length === 0) {
      content.innerHTML = `
        <div class="page-enter">
          <section class="section">
            <div class="empty-state">
              <span class="empty-icon">🛒</span>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any items yet. Start shopping to fill it up!</p>
              <a href="#/products" class="btn btn-primary" data-link>Browse Products</a>
            </div>
          </section>
        </div>`;
      return;
    }

    const savings = cartData.items.reduce((sum, item) => {
      const orig = item.product.price * item.quantity;
      return sum + (orig - item.lineTotal);
    }, 0);

    content.innerHTML = `
      <div class="page-enter">
        <section class="section" style="padding-top:32px">
          <div class="section-header">
            <div>
              <h2 class="section-title">Your Cart</h2>
              <p class="section-subtitle">${cartData.totalItems} item${cartData.totalItems !== 1 ? 's' : ''} in cart</p>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="CartPage.clearCart()">Clear Cart</button>
          </div>
          <div class="cart-layout">
            <div class="cart-items-list">
              ${cartData.items.map(item => CartItem.render(item)).join('')}
            </div>
            <div class="cart-summary">
              <div class="glass-card">
                <h3 class="summary-title">Order Summary</h3>
                <div class="summary-row">
                  <span>Subtotal (${cartData.totalItems} items)</span>
                  <span>₹${cartData.subtotal.toFixed(2)}</span>
                </div>
                ${savings > 0 ? `
                <div class="summary-row">
                  <span>Savings</span>
                  <span class="discount">−₹${savings.toFixed(2)}</span>
                </div>` : ''}
                <div class="summary-row">
                  <span>Delivery</span>
                  <span style="color:var(--accent)">FREE</span>
                </div>
                <div class="summary-row total">
                  <span>Total</span>
                  <span>₹${cartData.total.toFixed(2)}</span>
                </div>
                <a href="#/checkout" class="btn btn-primary checkout-btn" data-link>
                  Proceed to Checkout →
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  async updateQty(productId, newQty) {
    try {
      if (newQty <= 0) {
        await API.removeFromCart(productId);
      } else {
        await API.updateCartItem(productId, newQty);
      }
      Header.updateBadge();
      this.render();
    } catch (e) { Toast.error(e.message); }
  },

  async removeItem(productId) {
    try {
      await API.removeFromCart(productId);
      Toast.success('Item removed');
      Header.updateBadge();
      this.render();
    } catch (e) { Toast.error(e.message); }
  },

  async clearCart() {
    try {
      await API.clearCart();
      Toast.success('Cart cleared');
      Header.updateBadge();
      this.render();
    } catch (e) { Toast.error(e.message); }
  }
};
