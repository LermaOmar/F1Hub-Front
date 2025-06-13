import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../utils/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import UserTable from '../../../components/UserTable';
import UserFormModal from '../../../components/UserFormModal';
import '../../../styles/Management.css';

const UserPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [skipNotActive, setSkipNotActive] = useState(false);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const typingRef = useRef(null);

  const checkToken = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
    } else {
      axiosInstance.post('/auth/check')
        .then(() => fetchUsers())
        .catch(() => navigate('/login'));
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    checkToken();
  }, [skipNotActive]);

  const showTypingError = (text) => {
    if (!text || typeof text !== 'string') return;
    const clean = text.replace(/undefined/g, '').replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim();

    if (typingRef.current) clearInterval(typingRef.current);
    setErrorMessage('');
    setIsErrorVisible(true);

    let index = -1;
    typingRef.current = setInterval(() => {
      setErrorMessage(prev => prev + clean[index]);
      index++;
      if (index >= clean.length-1) {
        clearInterval(typingRef.current);
      }
    
    }, 40);
  };

  const fetchUsers = (page = 0) => {
    axiosInstance.get('/accounts', {
      params: {
        page,
        ...(skipNotActive && { skipNotActive: true })
      }
    })
    .then(res => {
      setUsers(res.data.content);
      setPagination({
        pageNumber: res.data.pageNumber,
        pageSize: res.data.pageSize,
        totalElements: res.data.totalElements,
        totalPages: res.data.totalPages
      });
    })
    .catch(err => {
      showTypingError(err?.response?.data?.error || err.message);
      if ([401, 403].includes(err.response?.status)) {
        setTimeout(() => navigate('/login'), 0);
      }
    });
  };

  const handlePageChange = (page) => fetchUsers(page);

  const handleSave = async (user, isNew) => {
    const body = {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      roles: user.roles,
      active: user.active
    };
    try {
      if (isNew) {
        await axiosInstance.post('/appUsers', body);
      } else {
        await axiosInstance.put(`/accounts/${user.id}`, body);
      }
      fetchUsers();
    } catch (err) {
      showTypingError(err?.response?.data?.error || err.message);
      if ([401, 403].includes(err.response?.status)) {
        setTimeout(() => navigate('/login'), 0);
      }
    } finally {
      setShowModal(false);
      setSelectedUser(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Wanna delete this user?')) {
      try {
        await axiosInstance.delete(`/appUsers/${id}`);
        fetchUsers();
      } catch (err) {
        showTypingError(err?.response?.data?.error || err.message);
        if ([401, 403].includes(err.response?.status)) {
          navigate('/login');
        }
      }
    }
  };

  const openModal = (user = null) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div className="user-page dark">
      <div className="header-controls">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        <button
          className="add-btn"
          onClick={() => openModal(null)}
        >
          ➕
        </button>
      </div>

      <div className="filter-toggle">
        <label className="switch-label">
          <span>Show only active users</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={skipNotActive}
              onChange={(e) => setSkipNotActive(e.target.checked)}
            />
            <span className="slider round" />
          </label>
        </label>
      </div>

      <h2 className="user-title">Users Management</h2>

      {isErrorVisible && errorMessage && (
        <div className="error-notification">
          <span className="error-message">{errorMessage}</span>
          <button
            className="error-close"
            onClick={() => {
              setIsErrorVisible(false);
              setErrorMessage('');
            }}
          >
            ❌
          </button>
        </div>
      )}

      <UserTable users={users} onEdit={(u) => openModal(u)} onDelete={handleDelete} />

      {showModal && (
        <UserFormModal
          user={selectedUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSave}
          isOpen={showModal}
        />
      )}

      <div className="pagination">
        <button onClick={() => handlePageChange(pagination.pageNumber - 1)}
                disabled={pagination.pageNumber === 0}>
          ◀ Prev
        </button>
        <span>Page {pagination.pageNumber + 1} of {pagination.totalPages}</span>
        <button onClick={() => handlePageChange(pagination.pageNumber + 1)}
                disabled={pagination.pageNumber + 1 >= pagination.totalPages}>
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default UserPage;
