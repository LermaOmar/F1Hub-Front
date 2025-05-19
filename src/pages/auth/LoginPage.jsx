import React, { useState, useEffect, useRef } from 'react';
import '../../styles/Auth.css';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [typedText, setTypedText] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const typingIntervalRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const credentials = { email, password };

    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      if (response.status === 200 && response.data.message) {
        localStorage.setItem('auth_token', response.data.message);
        navigate('/dashboard');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      showTypingEffect(message);
    }
  };

  const extractErrorMessage = (error) => {
    let message = 'Login failed. Please try again.';

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

    const clean = text
      .replace(/undefined/g, '')
      .replace(/\n/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    setTypedText('');
    setIsErrorVisible(true);

    let index = -1;
    typingIntervalRef.current = setInterval(() => {
      setTypedText((prev) => prev + clean[index]);
      index++;
      if (index >= clean.length-1) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    }, 40);
  };

  useEffect(() => {
    if (isErrorVisible) {
      setIsErrorVisible(false);
      setTypedText('');
    }
  }, [email, password]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-blur-wrapper">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
        {isErrorVisible && typedText && (
          <div className="error-notification">{typedText}</div>
        )}
      </form>
    </div>
    </div>
  );
}

export default LoginPage;
