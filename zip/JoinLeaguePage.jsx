import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/AxiosInstance';
import '../../../styles/JoinLeaguePage.css';

const JoinLeaguePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('loading');

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        navigate('/login');
    } else {
        axiosInstance.post('/auth/check')
        .then(() => {
            console.log("Valid token")
        })
        .catch((error) => {
            console.error('Token invalid or expired:', error);
            navigate('/login');
        });
    }
  }, []);
  
  useEffect(() => {
    const join = async () => {
      const userId = getUserIdFromToken();

      if (!userId) {
        setMessage('⚠️ You must be logged in to join a league.');
        setStatus('error');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        await axiosInstance.put(`/appUsers/joinLeague/${id}`, { id: userId });
        setMessage('✅ You have successfully joined the league!');
        setStatus('success');
        setTimeout(() => navigate('/leagues'), 3000);
      } catch (err) {
        const msg = err?.response?.data?.error;
        if (msg === 'User is already in this league') {
          setMessage('⚠️ You are already part of this league.');
        } else {
          setMessage('❌ Failed to join league.');
        }
        setStatus('error');
        setTimeout(() => navigate('/leagues'), 3000);
      }
    };

    join();
  }, [id, navigate]);

  return (
    <div className={`join-league-container ${status}`}>
      <div className="join-league-box">
        <h2>Joining League <span className="dots"><span>.</span><span>.</span><span>.</span></span></h2>
        <p className="join-status">{message}</p>
        <p className="sub-message">
            Redirecting <span className="dots"><span>.</span><span>.</span><span>.</span></span>
        </p>

      </div>
    </div>
  );
};

export default JoinLeaguePage;
