import React from 'react';

const ContentTable = ({ items, fields, onEdit, onDelete }) => {
  return (
    <table className="content-table">
      <thead>
        <tr>
          {fields.map((field) => (
            <th key={field.key}>{field.label}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            {fields.map((field) => (

            <td key={field.key}>
                {field.key === 'active'
                    ? item[field.key] ? '🟢 Active' : '🔴 Inactive'
                    : item[field.key]}
            </td>))}
            <td>
              <button onClick={() => onEdit(item)}>✏️</button>
            <button
            className="delete-btn"
            onClick={() => onDelete(item.id)}
            disabled={!item.active}
            >
            🗑️
            </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContentTable;
