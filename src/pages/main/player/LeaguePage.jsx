import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/AxiosInstance';
import '../../../styles/LeaguePage.css';
import LeagueModal from '../../../components/LeagueModal';
import { useNavigate } from 'react-router-dom';
import { useAjaxErrorHandler } from '../../../hooks/AjaxErrorHandler';


const LeaguePage = () => {
  const [leagues, setLeagues] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [newLeagueName, setNewLeagueName] = useState('');
  const [joinLeagueId, setJoinLeagueId] = useState('');
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate()
  const { typedText, isErrorVisible, handleAjaxError } = useAjaxErrorHandler();
  

  useEffect(() => {
    
    const id = getUserIdFromToken()
    setUserId(id)

  }, []);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || null;
    } catch (err) {
      console.error("Failed to parse token:", err);
      return null;
    }
  };


  useEffect(() => {
    fetchLeagues();
  }, [page]);

  const fetchLeagues = () => {
    axiosInstance.get(`/leagues?page=${page}`)
      .then(res => {
        setLeagues(res.data.content);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => {
        setLeagues([]);
        setTotalPages(1);
        handleAjaxError(err)
      });
  };

  const handleCreateLeague = async () => {
    if (!newLeagueName.trim()) {
      setErrorMessage('League name cannot be empty');
      return;
    }
    try {
      await axiosInstance.post('/leagues', { name: newLeagueName });
      fetchLeagues();
      closeModal();
    } catch (err) {
      handleAjaxError(err)
    }
    finally{
      closeModal()
    }
  };


  const handleLeaveLeague = async (id) => {
    try {
      console.log(userId)
      await axiosInstance.put(`/appUsers/leaveLeague/${id}`, { id: userId });
      fetchLeagues();
    } catch (err) {
      handleAjaxError(err)
    }
  };

  const handleCopyLink = (id) => {
    const link = `${window.location.origin}/join-league/${id}`;
    navigator.clipboard.writeText(link)
      .then(() => alert('Link copied!'))
      .catch(err => console.error('Failed to copy:', err));
  };

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
    setErrorMessage('');
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewLeagueName('');
    setJoinLeagueId('');
    setErrorMessage('');
  };


  return (
    <div className="leagues-page">
      <h1 className="title">My Leagues</h1>

      <div className="action-buttons">
              <div className="header-controls">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
        <button className="add-btn" onClick={() => openModal('create')}>➕</button>
      </div>
      </div>
        {isErrorVisible && typedText && (
          <div className="error-notification">{typedText}</div>
        )}
        {leagues.length === 0 ? (
        <p className="no-leagues">⚠️ No leagues available.</p>
      ) : (
        <ul className="leagues-list">
          {leagues.map((league) => (
            <li  onClick={() => navigate(`/player/leagues/${league.id}/lineup`)} key={league.id} className="league-item">
              <strong>{league.name}</strong>
              <div className="details">
                <span>Fantasy</span>
                <span>0 PF</span>
                <span>100,000,000</span>
              </div>
              <div className="league-actions">
                <button onClick={() => handleCopyLink(league.id)}>🔗</button>
                <button onClick={() => handleLeaveLeague(league.id)}>🚪 Leave</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination-controls">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>◀ Prev</button>
        <span>Page {leagues.length === 0 ? 0 : page + 1} of {leagues.length === 0 ? 0 : totalPages}</span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next ▶</button>
      </div>

      <LeagueModal
        isOpen={modalOpen}
        type={modalType}
        onClose={closeModal}
        newLeagueName={newLeagueName}
        joinLeagueId={joinLeagueId}
        errorMessage={errorMessage}
        setNewLeagueName={setNewLeagueName}
        setJoinLeagueId={setJoinLeagueId}
        handleCreateLeague={handleCreateLeague}
      />
    </div>
  );
};

export default LeaguePage;
