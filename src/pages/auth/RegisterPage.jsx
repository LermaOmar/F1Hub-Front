import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import '../../styles/Auth.css';
import axios from 'axios';


function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [typedText, setTypedText] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const typingIntervalRef = useRef(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const newAccount = { username, email, password };

    try {
      const response = await axiosInstance.post('/auth/register', newAccount);

      if (response.status === 200 || response.status === 201) {
        navigate('/');
      } else {
        throw new Error('Unexpected error');
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      showTypingEffect(message);
    }
  };

  const extractErrorMessage = (error) => {
    let message = 'Registration failed. Please try again.';

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
  }, [username, email, password]);

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
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <div>
          <label>Username:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
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
        <button type="submit">Register</button>
        <p>Already have an account? <Link to="/">Login here</Link></p>
        {isErrorVisible && typedText && (
          <div className="error-notification">{typedText}</div>
        )}
      </form>
    </div>
    </div>
  );
}

export default RegisterPage;
