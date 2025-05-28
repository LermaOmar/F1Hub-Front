import React, { useState, useRef, useEffect } from 'react';
import '../../styles/Auth.css';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import axios from 'axios';

function ResendVerificationPage() {
  const [email, setEmail] = useState('');
  const [typedText, setTypedText] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const typingIntervalRef = useRef(null);
  const navigate = useNavigate();

  const handleResend = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put(`/auth/resend-verification`, null, {
        params: { email }
      });

      if (response.status === 200) {
        showTypingEffect(response.data.message || 'Verification email sent successfully.');
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      showTypingEffect(message);
    }
  };

  const extractErrorMessage = (error) => {
    let message = 'An error occurred. Please try again.';

    if (axios.isAxiosError(error)) {
      const backendMessage = error?.response?.data?.error;
      if (backendMessage && typeof backendMessage === 'string') {
        message = backendMessage;
      } else if (error.message) {
        message = error.message;
      }
    }

    return message
      .replace(/undefined/g, '')
      .replace(/\n/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  };

  const showTypingEffect = (text) => {
    if (!text || typeof text !== 'string') return;

    const clean = text.trim().replace(/\s{2,}/g, ' ');
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    setTypedText('');
    setIsErrorVisible(true);

    let index = -1;
    typingIntervalRef.current = setInterval(() => {
      setTypedText((prev) => prev + clean[index]);
      index++;
      if (index >= clean.length - 1) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    }, 40);
  };

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-blur-wrapper">
        <form onSubmit={handleResend}>
          <h2>Resend Verification</h2>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Send</button>
          <p>Account activated? <Link to="/login">Back to login</Link></p>

          {isErrorVisible && typedText && (
            <div className="error-notification">{typedText}</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResendVerificationPage;
