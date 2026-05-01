/**
 * Orders page — view order history
 */
const OrdersPage = {
  async render() {
    const content = document.getElementById('page-content');
    if (!Auth.isLoggedIn()) {
      AuthModal.open(() => App.navigate());
      content.innerHTML = `
        <div class="page-enter"><section class="section">
          <div class="empty-state">
            <span class="empty-icon">🔒</span>
            <h2>Please login to view your orders</h2>
          </div>
        </section></div>`;
      return;
    }

    let orders = [];
    try {
      const res = await API.getOrders();
      orders = res.data;
    } catch (e) {
      Toast.error(e.message);
    }

    content.innerHTML = `
      <div class="page-enter">
        <section class="section" style="padding-top:32px">
          <div class="section-header">
            <div>
              <h2 class="section-title">Order History</h2>
              <p class="section-subtitle">${orders.length} order${orders.length !== 1 ? 's' : ''} placed</p>
            </div>
          </div>
          ${orders.length === 0
            ? `<div class="empty-state">
                 <span class="empty-icon">📦</span>
                 <h2>No orders yet</h2>
                 <p>Your order history will appear here after your first purchase.</p>
                 <a href="#/products" class="btn btn-primary" data-link>Start Shopping</a>
               </div>`
            : `<div class="orders-list">
                ${orders.map(order => `
                  <div class="order-card glass-card">
                    <div class="order-card-header">
                      <div>
                        <span class="order-card-id">Order #${order.id}</span>
                        <span class="order-card-date">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <span class="order-status order-status-${order.status}">${order.status}</span>
                    </div>
                    <div class="order-card-items">
                      ${order.items.map(item => `
                        <div class="order-card-item">
                          <span class="order-item-emoji">${item.image}</span>
                          <span class="order-item-name">${item.name}</span>
                          <span class="order-item-qty">×${item.quantity}</span>
                          <span class="order-item-price">₹${item.total.toFixed(2)}</span>
                        </div>
                      `).join('')}
                    </div>
                    <div class="order-card-footer">
                      <span>Delivered to: ${order.deliveryAddress || '—'}</span>
                      <span class="order-card-total">Total: ₹${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>`
          }
        </section>
      </div>
    `;
  }
};
