/**
 * Auth state manager — handles token, user, login state
 */
const Auth = {
  _user: null,
  _token: null,

  init() {
    this._token = localStorage.getItem('gm_token');
    const cached = localStorage.getItem('gm_user');
    if (cached) {
      try { this._user = JSON.parse(cached); } catch (e) { this._user = null; }
    }
  },

  isLoggedIn() {
    return !!this._token;
  },

  getToken() {
    return this._token;
  },

  getUser() {
    return this._user;
  },

  setSession(token, user) {
    this._token = token;
    this._user = user;
    localStorage.setItem('gm_token', token);
    localStorage.setItem('gm_user', JSON.stringify(user));
  },

  updateUser(user) {
    this._user = user;
    localStorage.setItem('gm_user', JSON.stringify(user));
  },

  logout() {
    this._token = null;
    this._user = null;
    localStorage.removeItem('gm_token');
    localStorage.removeItem('gm_user');
  },

  // Refresh user data from server
  async refreshUser() {
    if (!this.isLoggedIn()) return null;
    try {
      const res = await API.getMe();
      this.updateUser(res.data);
      return res.data;
    } catch (e) {
      // Token expired or invalid
      this.logout();
      return null;
    }
  }
};

// Initialize on load
Auth.init();
