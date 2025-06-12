import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '../styles/Management.css';

const rolesList = ['ADMIN', 'REVIEWER', 'PLAYER'];

const UserFormModal = ({ user, onSave, onClose, isOpen }) => {
  const isNew = !user;

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    roles: ['PLAYER'],
    active: true
  });

  useEffect(() => {
    if (user) {
      setForm({
        id: user.id,
        username: user.username,
        email: user.email,
        password: '',
        roles: user.roles || [],
        active: user.active ?? true
      });
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  if (!isOpen) return null;

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
    if (!form.username.trim() || !form.email.trim()) {
      alert('Username and Email are required.');
      return;
    }
    if (isNew && !form.password.trim()) {
      alert('Password is required for new users.');
      return;
    }
    if (form.roles.length === 0) {
      alert('Select at least one role.');
      return;
    }
    onSave(form, isNew);
  };

  const modal = (
    <div className="modal-overlay">
      <div className="modal-content fadeIn">
        <h3>{isNew ? 'Create User' : 'Edit User'}</h3>
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
            {rolesList.map((role) => (
              <label key={role}>
                <input
                  type="checkbox"
                  checked={form.roles.includes(role)}
                  onChange={() => handleRoles(role)}
                />
                {role}
              </label>
            ))}
          </div>

          <div className="active-toggle">
            <label className="switch">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, active: e.target.checked }))
                }
              />
              <span className="slider round" />
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

  return ReactDOM.createPortal(modal, document.body);
};

export default UserFormModal;
