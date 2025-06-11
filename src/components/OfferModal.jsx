import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import {useAjaxErrorHandler} from '../hooks/AjaxErrorHandler'


const OfferModal = ({ item, editing, leagueId, onClose }) => {
  const [amount, setAmount] = useState('');
  const { typedText, isErrorVisible, handleAjaxError } = useAjaxErrorHandler();
 
  const navigate = useNavigate()
  useEffect(() => {
    if (editing) {
      axiosInstance.get(`/offers/${leagueId}/league/${item.id}/item`)
        .then(res => setAmount(res.data.amount))
        .catch(() => {});
    }
  }, [editing, leagueId, item]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) navigate("/dashboard")
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user_id;
    } catch (e) {
        navigate("/dashboard")
    }
};

  const submit = () => {
    console.log(item)
    const payload = editing
      ? { amount }
      : { appUser: getUserIdFromToken(), league: leagueId, marketItem: item.id, amount };

    const method = editing ? 'put' : 'post';
    const url = editing
      ? `/offers/${leagueId}/league/${item.id}/item/${item.offerId}`
      : `/offers`;

    axiosInstance[method](url, payload)
      .then(() => window.location.reload())
      .catch(handleAjaxError);
  };

  return (
    <div className="modal-overlay">
      
      <div className="modal-content">
        <h3>{editing ? 'Edit Offer' : 'New Offer'}</h3>
        {isErrorVisible && typedText && (
          <div className="error-notification">{typedText}</div>
        )}
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button onClick={submit}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default OfferModal;
