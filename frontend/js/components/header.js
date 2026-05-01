/**
 * Header component with navigation, cart badge, and user profile dropdown
 */
const Header = {
  _dropdownOpen: false,

  async render() {
    const header = document.getElementById('main-header');
    const cartData = await API.getCart().catch(() => ({ data: { totalItems: 0 } }));
    const count = cartData.data.totalItems || 0;
    const hash = location.hash || '#/';
    const loggedIn = Auth.isLoggedIn();
    const user = Auth.getUser();

    const userSection = loggedIn && user
      ? `<div class="user-menu" id="user-menu">
           <button class="user-avatar-btn" onclick="Header.toggleDropdown()" id="user-avatar-btn">
             <span class="user-avatar">${user.name.charAt(0).toUpperCase()}</span>
             <span class="user-name-text">${user.name.split(' ')[0]}</span>
             <span class="dropdown-arrow">▾</span>
           </button>
           <div class="user-dropdown glass-card" id="user-dropdown">
             <div class="dropdown-user-info">
               <span class="dropdown-avatar">${user.name.charAt(0).toUpperCase()}</span>
               <div>
                 <div class="dropdown-name">${user.name}</div>
                 <div class="dropdown-email">${user.email}</div>
               </div>
             </div>
             <div class="dropdown-divider"></div>
             <a href="#/profile" class="dropdown-item" data-link onclick="Header.closeDropdown()">
               👤 My Profile
             </a>
             <a href="#/orders" class="dropdown-item" data-link onclick="Header.closeDropdown()">
               📦 Order History
             </a>
             <div class="dropdown-divider"></div>
             <button class="dropdown-item dropdown-logout" onclick="Header.handleLogout()">
               🚪 Logout
             </button>
           </div>
         </div>`
      : `<button class="btn btn-sm login-btn" onclick="AuthModal.open(() => App.navigate())">
           Login
         </button>`;

    header.className = 'site-header';
    header.innerHTML = `
      <div class="header-inner">
        <a href="#/" class="header-brand" data-link>
          <span class="header-logo">🛒</span>
          <span class="header-name">GoseriMart</span>
        </a>
        <nav class="header-nav" id="header-nav">
          <a href="#/" class="${hash === '#/' ? 'active' : ''}" data-link>
            <span class="nav-text">Home</span>
          </a>
          <a href="#/products" class="${hash.startsWith('#/products') ? 'active' : ''}" data-link>
            <span class="nav-text">Products</span>
          </a>
          <a href="#/cart" class="cart-link ${hash.startsWith('#/cart') ? 'active' : ''}" data-link id="cart-nav-link">
            🛒 <span class="nav-text">Cart</span>
            <span class="cart-badge ${count === 0 ? 'empty' : ''}" id="cart-badge">${count}</span>
          </a>
          ${userSection}
        </nav>
      </div>
    `;

    // Close dropdown when clicking outside
    document.addEventListener('click', this._outsideClick);
  },

  _outsideClick(e) {
    const menu = document.getElementById('user-menu');
    if (menu && !menu.contains(e.target)) {
      Header.closeDropdown();
    }
  },

  toggleDropdown() {
    const dd = document.getElementById('user-dropdown');
    if (!dd) return;
    this._dropdownOpen = !this._dropdownOpen;
    dd.classList.toggle('open', this._dropdownOpen);
  },

  closeDropdown() {
    this._dropdownOpen = false;
    const dd = document.getElementById('user-dropdown');
    if (dd) dd.classList.remove('open');
  },

  handleLogout() {
    Auth.logout();
    this.closeDropdown();
    Toast.success('Logged out successfully');
    Header.render();
    location.hash = '#/';
  },

  async updateBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    try {
      const cartData = await API.getCart();
      const count = cartData.data.totalItems || 0;
      badge.textContent = count;
      badge.className = `cart-badge ${count === 0 ? 'empty' : ''}`;
      if (count > 0) {
        badge.style.animation = 'none';
        badge.offsetHeight;
        badge.style.animation = 'badgePop 0.3s ease';
      }
    } catch (e) { /* ignore */ }
  }
};
