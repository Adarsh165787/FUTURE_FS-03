const { v4: uuidv4 } = require('uuid');

/**
 * In-memory Order state manager
 */
class OrderStore {
  constructor() {
    this.orders = [];
  }

  createOrder(cartItems, products, customerInfo) {
    // Build order items with price snapshot
    const orderItems = cartItems.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      const price = product.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product.price;
      return {
        productId: cartItem.productId,
        name: product.name,
        image: product.image,
        quantity: cartItem.quantity,
        unitPrice: Math.round(price * 100) / 100,
        total: Math.round(price * cartItem.quantity * 100) / 100
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);

    const order = {
      id: uuidv4().slice(0, 8).toUpperCase(),
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      total: Math.round(subtotal * 100) / 100,
      status: 'placed',
      createdAt: new Date().toISOString(),
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      deliveryAddress: customerInfo.address
    };

    this.orders.unshift(order); // newest first
    return order;
  }

  getAll() {
    return [...this.orders];
  }

  getById(id) {
    return this.orders.find(order => order.id === id) || null;
  }
}

module.exports = new OrderStore();
