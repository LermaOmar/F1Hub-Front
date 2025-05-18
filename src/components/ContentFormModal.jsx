import React, { useState, useEffect } from 'react';

const ContentFormModal = ({ item, onClose, onSave, fields }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      const initialData = {};
      fields.forEach((field) => {
        initialData[field.key] = field.type === 'checkbox' ? false : '';
      });
      setFormData(initialData);
    }
  }, [item, fields]);

  const handleChange = (e, key, type) => {
    const value = type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, !item);
  };

  return (
    <div className="modal-overlay">
      <div className="modal dark">
        <h3>{item ? 'Edit' : 'Create'} Item</h3>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.key} className="form-group">
              <label>{field.label}</label>
              {field.type === 'checkbox' ? (
                <div className="active-toggle">
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={formData[field.key] || false}
                            onChange={(e) => handleChange(e, field.key, field.type)}
                        />
                        <span className="slider round"></span>
                    </label>
                    <span className="checkbox-label">Active</span>
                </div>

              ) : (
                <input
                  type={field.type || 'text'}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(e, field.key, field.type)}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentFormModal;
