import React, { useState, useEffect } from 'react';
import '../styles/Management.css';

const rolesList = ['ADMIN', 'REVIEWER', 'PLAYER'];

const UserFormModal = ({ user, onSave, onClose }) => {
  const isNew = !user;
const [form, setForm] = useState({
  username: '',
  email: '',
  password: '',
  roles: ['PLAYER'],
  active: false
});


  useEffect(() => {
    if (user) {
      setForm({
        id: user.id,
        username: user.username,
        email: user.email,
        password: '',
        roles: user.roles || [],
        active: user.active ?? false

      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoles = (role) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.roles.length === 0) {
      alert('Please select at least one role.');
      return;
    }
    onSave(form, isNew);
  };

  return (
    <div className="modal-overlay">
      <div className="modal dark">
        <h3>{isNew ? 'Create' : 'Edit'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required={isNew}
          />
          <div className="roles">
            {rolesList.map((r) => (
              <label key={r}>
                <input
                  type="checkbox"
                  checked={form.roles.includes(r)}
                  onChange={() => handleRoles(r)}
                />
                {r}
              </label>
            ))}
          </div>
            <div className="active-toggle">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm(prev => ({ ...prev, active: e.target.checked }))}
                />
                <span className="slider round"></span>
              </label>
              <span className="checkbox-label">Active</span>
            </div>



          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
