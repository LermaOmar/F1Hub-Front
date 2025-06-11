import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import '../../styles/Management.css';

const ActivateAccountPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activate = async () => {
      try {
        await axiosInstance.put(`/auth/activate?token=${token}`);
        setMessage('✅ Your account has been activated successfully!');
        setStatus('success');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setMessage('❌ Activation failed. The token might be invalid or expired.');
        setStatus('error');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    activate();
  }, [token, navigate]);

  return (
    <div className={`activation-container ${status}`}>
      <div className="activation-box">
        <h2>Activating account <span className="dots"><span>.</span><span>.</span><span>.</span></span></h2>
        <p className="activation-status">{message}</p>
        <p className="sub-message">
          Redirecting...
          <span className="dots"><span>.</span><span>.</span><span>.</span></span>
        </p>
      </div>
    </div>
  );
};

export default ActivateAccountPage;
