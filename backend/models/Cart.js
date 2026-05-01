/**
 * In-memory Cart state manager
 * Stores cart items as { productId, quantity } pairs
 */
class Cart {
  constructor() {
    this.items = [];
  }

  getItems() {
    return [...this.items];
  }

  addItem(productId, quantity = 1) {
    const existing = this.items.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ productId, quantity });
    }
    return this.getItems();
  }

  updateItem(productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    const existing = this.items.find(item => item.productId === productId);
    if (!existing) {
      return null; // item not found
    }
    existing.quantity = quantity;
    return this.getItems();
  }

  removeItem(productId) {
    const index = this.items.findIndex(item => item.productId === productId);
    if (index === -1) return null;
    this.items.splice(index, 1);
    return this.getItems();
  }

  clear() {
    this.items = [];
    return this.getItems();
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// Singleton instance
module.exports = new Cart();
