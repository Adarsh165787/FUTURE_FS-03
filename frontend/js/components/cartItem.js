/**
 * Cart item component for the cart page
 */
const CartItem = {
  render(item) {
    const { product, quantity, unitPrice, lineTotal } = item;
    return `
      <div class="cart-item glass-card" id="cart-item-${product.id}">
        <div class="cart-item-image">${product.image}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">₹${unitPrice} / ${product.unit}</div>
        </div>
        <div class="cart-item-controls">
          <div class="qty-controls">
            <button onclick="CartPage.updateQty('${product.id}', ${quantity - 1})">−</button>
            <span class="qty-value">${quantity}</span>
            <button onclick="CartPage.updateQty('${product.id}', ${quantity + 1})">+</button>
          </div>
        </div>
        <div class="cart-item-total">₹${lineTotal.toFixed(2)}</div>
        <button class="cart-item-remove" onclick="CartPage.removeItem('${product.id}')" title="Remove">✕</button>
      </div>
    `;
  }
};
