import React from 'react';

const AdminGuide = () => (
  <div className="guide-section">
    <h1>Administrator Guide</h1>

    <section id="user-management">
      <h2>👥 User Management</h2>
      <p>Administrators can manage user accounts with the following actions:</p>
      <ul>
        <li><strong>Edit user</strong> by clicking the ✏️ icon to open a dialog and update user details.</li>
        <li><strong>Soft-delete user</strong> by clicking the 🗑️ icon — the user is marked inactive but not permanently removed.</li>
        <li><strong>Create new user</strong> by clicking the yellow “➕” button at the top.</li>
        <li><strong>Filter active users</strong> using the "Show only active users" toggle.</li>
      </ul>
      <img src={`${import.meta.env.BASE_URL}docs/admin-panel-user.png`} alt="Admin User Panel" className="doc-image" />
    </section>

    <section id="create-edit-user">
      <h2>📝 Editing / Creating a User</h2>
      <p>The dialog allows:</p>
      <ul>
        <li>Entering <code>Username</code>, <code>Email</code>, and <code>Password</code>.</li>
        <li>Selecting roles: <code>ADMIN</code>, <code>REVIEWER</code>, <code>PLAYER</code>.</li>
        <li>Setting active state with a toggle.</li>
        <li>Saving or canceling with the buttons below.</li>
      </ul>
      <img src={`${import.meta.env.BASE_URL}docs/user-modal.png`} alt="User Dialog" className="doc-image" />
    </section>

    <section id="content-management">
      <h2>🗂️ Teams & Drivers Management</h2>
      <p>Switch between <strong>Teams</strong> and <strong>Drivers</strong> using the tabs at the top.</p>
      <ul>
        <li>Edit or soft-delete an entry using the ✏️ or 🗑️ icons.</li>
        <li>Create a new Team or Driver using the “➕” button.</li>
        <li>Filter active entries using the toggle switch.</li>
      </ul>
      <img src={`${import.meta.env.BASE_URL}docs/admin-panel-content.png`} alt="Admin Content Panel" className="doc-image" />
    </section>

    <section id="create-edit-item">
      <h2>🛠️ Creating / Editing an Item</h2>
      <p>The dialog content adapts depending on whether you're in the Teams or Drivers section:</p>
      <ul>
        <li>Enter Name, Nationality, Price.</li>
        <li>Toggle active state.</li>
        <li>Upload an image representing the item.</li>
        <li>Save or cancel your changes.</li>
      </ul>
      <img src={`${import.meta.env.BASE_URL}docs/item-modal.png`} alt="Content Dialog" className="doc-image" />
    </section>
  </div>
);

export default AdminGuide;
