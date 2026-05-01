/**
 * Profile page — view and edit user details
 */
const ProfilePage = {
  async render() {
    const content = document.getElementById('page-content');
    if (!Auth.isLoggedIn()) {
      AuthModal.open(() => App.navigate());
      content.innerHTML = `
        <div class="page-enter"><section class="section">
          <div class="empty-state">
            <span class="empty-icon">🔒</span>
            <h2>Please login to view your profile</h2>
          </div>
        </section></div>`;
      return;
    }

    let user;
    try {
      const res = await API.getMe();
      user = res.data;
      Auth.updateUser(user);
    } catch (e) {
      Auth.logout();
      Header.render();
      location.hash = '#/';
      return;
    }

    content.innerHTML = `
      <div class="page-enter">
        <section class="section" style="padding-top:32px">
          <div class="section-header">
            <div>
              <h2 class="section-title">My Profile</h2>
              <p class="section-subtitle">Manage your account details</p>
            </div>
          </div>
          <div class="profile-layout">
            <div class="profile-card glass-card">
              <div class="profile-avatar-large">${user.name.charAt(0).toUpperCase()}</div>
              <h3 class="profile-card-name">${user.name}</h3>
              <p class="profile-card-email">${user.email}</p>
              <p class="profile-card-since">Member since ${new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
            </div>
            <div class="profile-form-wrap">
              <div class="glass-card" style="padding:32px">
                <h3 class="form-title">Edit Details</h3>
                <form onsubmit="ProfilePage.save(event)">
                  <div class="form-group">
                    <label for="prof-name">Full Name</label>
                    <input type="text" id="prof-name" value="${user.name}" required minlength="2">
                  </div>
                  <div class="form-group">
                    <label for="prof-email">Email</label>
                    <input type="email" id="prof-email" value="${user.email}" disabled
                      style="opacity:0.5;cursor:not-allowed">
                    <span style="font-size:12px;color:var(--text-muted)">Email cannot be changed</span>
                  </div>
                  <div class="form-group">
                    <label for="prof-phone">Phone</label>
                    <input type="tel" id="prof-phone" value="${user.phone || ''}" placeholder="+91 98765 43210">
                  </div>
                  <div class="form-group">
                    <label for="prof-address">Default Delivery Address</label>
                    <textarea id="prof-address" placeholder="123 Main St, City">${user.address || ''}</textarea>
                  </div>
                  <button type="submit" class="btn btn-primary" id="prof-save-btn">Save Changes</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  async save(e) {
    e.preventDefault();
    const btn = document.getElementById('prof-save-btn');
    btn.textContent = 'Saving...';
    btn.disabled = true;
    try {
      const res = await API.updateProfile({
        name: document.getElementById('prof-name').value.trim(),
        phone: document.getElementById('prof-phone').value.trim(),
        address: document.getElementById('prof-address').value.trim()
      });
      Auth.updateUser(res.data);
      Toast.success('Profile updated!');
      Header.render();
    } catch (err) {
      Toast.error(err.message);
    }
    btn.textContent = 'Save Changes';
    btn.disabled = false;
  }
};
