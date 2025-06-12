import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const ContentFormModal = ({ item, onClose, onSave, fields, isOpen }) => {
  const [formData, setFormData] = useState({});
  const [previewImages, setPreviewImages] = useState({});

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

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e, key, type) => {
    const value = type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [key]: reader.result }));
        setPreviewImages((prev) => ({ ...prev, [key]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, !item); 
  };

  const modal = (
    <div className="modal-overlay">
      <div className="modal-content fadeIn">
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
              ) : field.type === 'image' ? (
                <>
                  <div className="image-upload-wrapper">
                    <label className="file-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, field.key)}
                        required={field.required}
                      />
                      <span className="upload-button">📁 Upload Image</span>
                    </label>

                    {previewImages[field.key] && (
                      <div className="preview-box">
                        <img
                          src={previewImages[field.key]}
                          alt="Preview"
                          className="img-preview"
                        />
                        <p className="file-name">✔️ Image ready</p>
                      </div>
                    )}
                  </div>
                </>
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

  return ReactDOM.createPortal(modal, document.body);
};

export default ContentFormModal;
