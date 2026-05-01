/**
 * Auth Modal component — Login & Signup tabs
 */
const AuthModal = {
  _onSuccess: null,
  _isOpen: false,

  open(onSuccess) {
    this._onSuccess = onSuccess || null;
    this._isOpen = true;
    const container = document.getElementById('auth-modal-container');
    container.innerHTML = this._renderHTML('login');
    container.classList.add('visible');
    document.body.style.overflow = 'hidden';
    // Focus first input
    setTimeout(() => {
      const input = container.querySelector('input');
      if (input) input.focus();
    }, 100);
  },

  close() {
    this._isOpen = false;
    const container = document.getElementById('auth-modal-container');
    container.classList.remove('visible');
    document.body.style.overflow = '';
    setTimeout(() => { container.innerHTML = ''; }, 300);
  },

  switchTab(tab) {
    const container = document.getElementById('auth-modal-container');
    const card = container.querySelector('.auth-modal-card');
    card.innerHTML = tab === 'signup' ? this._signupForm() : this._loginForm();
    setTimeout(() => {
      const input = card.querySelector('input');
      if (input) input.focus();
    }, 50);
  },

  _renderHTML(tab) {
    return `
      <div class="auth-overlay" onclick="AuthModal.close()"></div>
      <div class="auth-modal glass-card auth-modal-card">
        ${tab === 'signup' ? this._signupForm() : this._loginForm()}
      </div>
    `;
  },

  _loginForm() {
    return `
      <div class="auth-header">
        <h2 class="auth-title">Welcome Back</h2>
        <p class="auth-subtitle">Sign in to your GoseriMart account</p>
      </div>
      <div class="auth-tabs">
        <button class="auth-tab active" onclick="AuthModal.switchTab('login')">Login</button>
        <button class="auth-tab" onclick="AuthModal.switchTab('signup')">Sign Up</button>
      </div>
      <form onsubmit="AuthModal.handleLogin(event)" class="auth-form">
        <div class="form-group">
          <label for="auth-email">Email</label>
          <input type="email" id="auth-email" placeholder="you@example.com" required>
        </div>
        <div class="form-group">
          <label for="auth-password">Password</label>
          <input type="password" id="auth-password" placeholder="••••••••" required minlength="6">
        </div>
        <div class="auth-error" id="auth-error"></div>
        <button type="submit" class="btn btn-primary auth-submit" id="auth-submit-btn">
          Sign In
        </button>
      </form>
      <p class="auth-footer-text">
        Don't have an account? <a href="#" onclick="event.preventDefault();AuthModal.switchTab('signup')">Create one</a>
      </p>
    `;
  },

  _signupForm() {
    return `
      <div class="auth-header">
        <h2 class="auth-title">Create Account</h2>
        <p class="auth-subtitle">Join GoseriMart for fresh groceries</p>
      </div>
      <div class="auth-tabs">
        <button class="auth-tab" onclick="AuthModal.switchTab('login')">Login</button>
        <button class="auth-tab active" onclick="AuthModal.switchTab('signup')">Sign Up</button>
      </div>
      <form onsubmit="AuthModal.handleSignup(event)" class="auth-form">
        <div class="form-group">
          <label for="auth-name">Full Name</label>
          <input type="text" id="auth-name" placeholder="John Doe" required minlength="2">
        </div>
        <div class="form-group">
          <label for="auth-email">Email</label>
          <input type="email" id="auth-email" placeholder="you@example.com" required>
        </div>
        <div class="form-group">
          <label for="auth-password">Password</label>
          <input type="password" id="auth-password" placeholder="Min 6 characters" required minlength="6">
        </div>
        <div class="form-group">
          <label for="auth-phone">Phone (optional)</label>
          <input type="tel" id="auth-phone" placeholder="+91 98765 43210">
        </div>
        <div class="auth-error" id="auth-error"></div>
        <button type="submit" class="btn btn-primary auth-submit" id="auth-submit-btn">
          Create Account
        </button>
      </form>
      <p class="auth-footer-text">
        Already have an account? <a href="#" onclick="event.preventDefault();AuthModal.switchTab('login')">Sign in</a>
      </p>
    `;
  },

  _showError(msg) {
    const el = document.getElementById('auth-error');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  },

  _setLoading(loading) {
    const btn = document.getElementById('auth-submit-btn');
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? 'Please wait...' : btn.dataset.originalText || btn.textContent;
  },

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const btn = document.getElementById('auth-submit-btn');
    btn.dataset.originalText = btn.textContent;
    this._setLoading(true);

    try {
      const res = await API.login(email, password);
      Auth.setSession(res.data.token, res.data.user);
      Toast.success(`Welcome back, ${res.data.user.name}!`);
      this.close();
      Header.render();
      if (this._onSuccess) this._onSuccess();
    } catch (err) {
      this._showError(err.message);
      this._setLoading(false);
    }
  },

  async handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('auth-name').value.trim();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const phone = document.getElementById('auth-phone')?.value.trim() || '';
    const btn = document.getElementById('auth-submit-btn');
    btn.dataset.originalText = btn.textContent;
    this._setLoading(true);

    try {
      const res = await API.signup(name, email, password, phone);
      Auth.setSession(res.data.token, res.data.user);
      Toast.success(`Welcome to GoseriMart, ${res.data.user.name}!`);
      this.close();
      Header.render();
      if (this._onSuccess) this._onSuccess();
    } catch (err) {
      this._showError(err.message);
      this._setLoading(false);
    }
  }
};
