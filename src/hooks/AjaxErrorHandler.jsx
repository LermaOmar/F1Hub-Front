import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';

export function useAjaxErrorHandler() {
  const navigate = useNavigate();
  const typingRef = useRef(null);
  const [typedText, setTypedText] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const showTyping = (text) => {
    if (!text) return;
    const clean = text.replace(/undefined/g, '').replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim();
    clearInterval(typingRef.current);
    setTypedText('');
    setIsErrorVisible(true);
    let i = -1;
    typingRef.current = setInterval(() => {
      setTypedText((p) => p + clean[i]);
      i++;
      if (i >= clean.length-1) {
        clearInterval(typingRef.current);
        setTimeout(() => setIsErrorVisible(false), 3000);
      }
    }, 40);
  };

  const handleAjaxError = (error) => {
    const status = error?.response?.status;
    const msg = error?.response?.data?.error || error?.message || 'Unknown error';

    if (status === 401 || status === 403) {
      navigate('/login');
    } else {
      showTyping(msg);
    }
  };

  return { typedText, isErrorVisible, handleAjaxError };
}
