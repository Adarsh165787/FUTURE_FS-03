/**
 * Product card component
 */
const ProductCard = {
  render(product, cartItems = []) {
    const inCart = cartItems.find(i => i.productId === product.id);
    const discountedPrice = product.discount > 0
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;

    const priceHTML = product.discount > 0
      ? `₹${discountedPrice}<span class="original">₹${product.price}</span>`
      : `₹${product.price}`;

    const footerHTML = inCart
      ? `<div class="qty-controls">
           <button onclick="ProductCard.updateQty('${product.id}', ${inCart.quantity - 1})">−</button>
           <span class="qty-value">${inCart.quantity}</span>
           <button onclick="ProductCard.updateQty('${product.id}', ${inCart.quantity + 1})">+</button>
         </div>`
      : `<button class="add-cart-btn" onclick="ProductCard.addToCart('${product.id}', this)">
           Add to Cart
         </button>`;

    return `
      <div class="product-card glass-card" id="product-${product.id}">
        <div class="product-card-image">
          <span>${product.image}</span>
          ${product.discount > 0 ? `<span class="product-discount-tag">${product.discount}% OFF</span>` : ''}
        </div>
        <div class="product-card-body">
          <span class="product-category">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-price-row">
            <span class="product-price">${priceHTML}</span>
            <span class="product-unit">per ${product.unit}</span>
          </div>
        </div>
        <div class="product-card-footer">
          ${footerHTML}
        </div>
      </div>
    `;
  },

  async addToCart(productId, btn) {
    try {
      btn.textContent = '✓ Added';
      btn.classList.add('added');
      const res = await API.addToCart(productId);
      Toast.success(res.message);
      Header.updateBadge();
      // Refresh the card with qty controls
      if (typeof ProductsPage !== 'undefined' && ProductsPage.refreshCard) {
        ProductsPage.refreshCard(productId);
      }
    } catch (e) {
      btn.textContent = 'Add to Cart';
      btn.classList.remove('added');
      Toast.error(e.message);
    }
  },

  async updateQty(productId, newQty) {
    try {
      if (newQty <= 0) {
        await API.removeFromCart(productId);
      } else {
        await API.updateCartItem(productId, newQty);
      }
      Header.updateBadge();
      // Refresh depending on current page
      if (typeof ProductsPage !== 'undefined' && ProductsPage.refreshCard) {
        ProductsPage.refreshCard(productId);
      }
      if (typeof CartPage !== 'undefined' && CartPage.render) {
        CartPage.render();
      }
    } catch (e) {
      Toast.error(e.message);
    }
  }
};
