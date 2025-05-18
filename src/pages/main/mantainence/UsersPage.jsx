import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import UserTable from '../../../components/UserTable';
import UserFormModal from '../../../components/UserFormModal';
import '../../../styles/UserManagement.css';

const UserPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0
  });

    useEffect(() => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        navigate('/login');
    } else {
        axiosInstance.post('/auth/check')
        .then(() => {
            console.log("Valid token")
            fetchUsers();
        })
        .catch((error) => {
            console.error('Token invalid or expired:', error);
            navigate('/login');
        });
    }
    }, []);


  const fetchUsers = () => {
    axiosInstance.get('/accounts')
      .then(response => {
        setUsers(response.data.content);
        setPagination({
          pageNumber: response.data.pageNumber,
          pageSize: response.data.pageSize,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages
        });
      })
      .catch(error => {
        console.error('Error fetching users', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
            setTimeout(() => navigate('/login'), 0)
        }
        });

  };

  const handleSave = async (user, isNew) => {
    const body = {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      roles: user.roles,
      active: user.active
      
    };
    console.log(body)

    try {
      if (isNew) {
        await axiosInstance.post('/appUsers', body);
      } else {
        await axiosInstance.put(`/accounts/${user.id}`, body);
      }
      fetchUsers();
    } catch (error) {
  console.error('Error deleting user:', error);
  if (error.response?.status === 401 || error.response?.status === 403) {
    setTimeout(() => navigate('/login'), 0); // 🔁 FIX
  }
}

    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Wanna delete this user?')) {
      try {
        await axiosInstance.delete(`/appUsers/${id}`);
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        }
      }
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div className="user-page dark">
      <div className="user-header">
        <button className="add-btn" onClick={() => openModal(null)}>➕</button>
      </div>
      <h2 className="user-title">Users Management</h2>
      <UserTable users={users} onEdit={openModal} onDelete={handleDelete} />
      {showModal && (
        <UserFormModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default UserPage;
