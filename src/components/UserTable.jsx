import React from 'react';
import '../styles/Management.css';

const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <table className="user-table dark">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Active</th>
          <th>Manage</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(users) && users.map(u => (
            
            <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.roles.join(', ')}</td>
                <td>{u.active ? '🟢 Active' : '🔴 Inactive'}</td>
                <td>
                    <button onClick={() =>onEdit({id: u.id, username: u.username, email: u.email, roles: u.roles, active: u.active})}>✏️</button>
                    <button onClick={() => onDelete(u.id)} className="delete-btn">🗑️</button>
                </td>
            </tr>
        ))}
      </tbody>
    </table>
    
  );
};

export default UserTable;
