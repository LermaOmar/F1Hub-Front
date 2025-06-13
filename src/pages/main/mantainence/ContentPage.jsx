import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/AxiosInstance';
import ContentTable from '../../../components/ContentTable';
import ContentFormModal from '../../../components/ContentFormModal';
import '../../../styles/Management.css';

const ContentPage = ({ entityName, endpoint, fields }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
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

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // === NEW helpers for modal reset ===
  const openCreateModal = () => {
    setSelectedItem(null);
    setShowModal(true);
  };
  const openEditModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };
  // ====================================

  const checkToken = () =>{
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
    } else {
      axiosInstance.post('/auth/check')
        .then(() => fetchItems())
        .catch(() => navigate('/login'));
    }
  };

  useEffect(() => {
    checkToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchItems();
  }, [skipNotActive, endpoint, fields]);

  const showTypingError = (text) => {
    if (!text || typeof text !== 'string') return;
    const clean = text
      .replace(/undefined/g, '')
      .replace(/\n/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    if (typingRef.current) clearInterval(typingRef.current);
    setErrorMessage('');
    setIsErrorVisible(true);

    let index = 0;
    typingRef.current = setInterval(() => {
      setErrorMessage((prev) => prev + clean[index]);
      index++;
      if (index >= clean.length) {
        clearInterval(typingRef.current);
        setTimeout(() => {
          setIsErrorVisible(false);
          setErrorMessage('');
        }, 3000);
      }
    }, 40);
  };

  const fetchItems = (page = 0) => {
    axiosInstance
      .get(`/${endpoint}`, {
        params: {
          page,
          ...(skipNotActive && { skipNotActive: true })
        }
      })
      .then((response) => {
        setItems(response.data.content);
        setPagination({
          pageNumber: response.data.pageNumber,
          pageSize: response.data.pageSize,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages
        });
      })
      .catch((error) => {
        showTypingError(error?.response?.data?.error || error.message || 'Unexpected error occurred');
        if ([401, 403].includes(error.response?.status)) {
          navigate('/login');
        }
      });
  };

  const handlePageChange = (page) => {
    fetchItems(page);
  };

  const handleSave = async (item, isNew) => {
    try {
      const processed = { ...item };
      for (const f of fields) {
        if (f.type === 'image' && processed[f.key] instanceof File) {
          processed[f.key] = await fileToBase64(processed[f.key]);
        }
      }
      if (isNew) {
        await axiosInstance.post(`/${endpoint}`, processed);
      } else {
        await axiosInstance.put(`/${endpoint}/${item.id}`, processed);
      }
      fetchItems();
      // === now reset & close ===
      closeModal();
    } catch (error) {
      showTypingError(error?.response?.data?.error || error.message || 'Unexpected error occurred');
      if ([401, 403].includes(error.response?.status)) {
        navigate('/login');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Do you want to delete this ${entityName}?`)) return;
    try {
      await axiosInstance.put(`/${endpoint}/deactivate/${id}`);
      fetchItems();
    } catch (error) {
      showTypingError(error?.response?.data?.error || error.message || 'Unexpected error occurred');
      if ([401, 403].includes(error.response?.status)) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="content-page dark">
      <div className="header-controls">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        {/* use our create helper */}
        <button className="add-btn" onClick={openCreateModal}>
          ➕
        </button>
      </div>

      <div className="filter-toggle">
        <label className="switch-label">
          <span>Show only active {entityName}s</span>
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

      <h2 className="content-title">
        {entityName.charAt(0).toUpperCase() + entityName.slice(1)} Management
      </h2>

      {isErrorVisible && (
        <div className="error-notification">
          {errorMessage}
          <button className="close-btn" onClick={() => setIsErrorVisible(false)}>
            &times;
          </button>
        </div>
      )}

      <ContentTable
        items={items}
        fields={fields}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {showModal && (
        <ContentFormModal
          item={selectedItem}
          onClose={closeModal}
          onSave={handleSave}
          fields={fields}
          isOpen={showModal}
        />
      )}

      <div className="pagination">
        <button
          onClick={() => handlePageChange(pagination.pageNumber - 1)}
          disabled={pagination.pageNumber === 0}
        >
          ◀ Prev
        </button>

        <span>
          Page {pagination.pageNumber + 1} of {pagination.totalPages}
        </span>

        <button
          onClick={() => handlePageChange(pagination.pageNumber + 1)}
          disabled={pagination.pageNumber + 1 >= pagination.totalPages}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default ContentPage;
