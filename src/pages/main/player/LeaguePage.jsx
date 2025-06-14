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
  const navigate = useNavigate();
  const { typedText, isErrorVisible, handleAjaxError } = useAjaxErrorHandler();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.user_id);
      } catch {}
    }
  }, []);

  useEffect(() => {
    fetchLeagues();
  }, [page, userId]);

  const fetchLeagues = async () => {
    try {
      const res = await axiosInstance.get(`/leagues?page=${page}`);
      setTotalPages(res.data.totalPages || 1);
      const basic = res.data.content || [];

      const detailed = await Promise.all(basic.map(async league => {
        let points = 0, budget = 0;

        try {
          const lineupRes = await axiosInstance.get(
            `/lineUps/${league.id}/league/mine`
          );
          const { drivers = [], team } = lineupRes.data;
          points = drivers.reduce(
            (sum, d) => sum + (d.previousPoints || 0),
            0
          ) + (team?.previousPoints || 0);
        } catch (err) {
          
        }

        if (userId) {
          try {
            const budgetRes = await axiosInstance.get(
              `/budgets/${userId}/user/${league.id}/league`
            );
            budget = budgetRes.data.budgetValue;
          } catch (err) {
          }
        }

        return { ...league, points, budget };
      }));

      setLeagues(detailed);
    } catch (err) {
      handleAjaxError(err);
      setLeagues([]);
      setTotalPages(1);
    }
  };

  const handleCreateLeague = async () => {
    if (!newLeagueName.trim()) {
      setErrorMessage('League name cannot be empty');
      return;
    }
    try {
      await axiosInstance.post('/leagues', { name: newLeagueName });
      setModalOpen(false);
      fetchLeagues();
    } catch (err) {
      handleAjaxError(err);
      setModalOpen(false);
    }
  };

  const handleLeaveLeague = async (id) => {
    try {
      await axiosInstance.put(`/appUsers/leaveLeague/${id}`, { id: userId });
      fetchLeagues();
    } catch (err) {
      handleAjaxError(err);
    }
  };

  const handleCopyLink = (id) => {
    const link = `https://lermaomar.github.io/F1Hub-Front/#/join-league/${id}`;
    navigator.clipboard.writeText(link);
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

      <div className="header-controls">
        <button
          className="back-btn"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
        <button
          className="add-btn"
          onClick={() => openModal('create')}
        >
          ➕
        </button>
      </div>

      {isErrorVisible && typedText && (
        <div className="error-notification">{typedText}</div>
      )}

      {leagues.length === 0 ? (
        <p className="no-leagues">⚠️ No leagues available.</p>
      ) : (
        <ul className="leagues-list">
          {leagues.map(league => (
            <li key={league.id} className="league-item">
              <span
                className="league-name"
                onClick={() =>
                  navigate(`/player/leagues/${league.id}/lineup`)
                }
              >
                {league.name}
              </span>
              <div className="details">
                <span>Points: {league.points}</span>
                <span>Budget: {league.budget ?? '—'}</span>
              </div>
              <div className="league-actions">
                <button onClick={() => handleCopyLink(league.id)}>
                  🔗
                </button>
                <button onClick={() => handleLeaveLeague(league.id)}>
                  🚪 Leave
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination-controls">
        <button
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
        >
          ◀ Prev
        </button>
        <span>
          Page {leagues.length ? page + 1 : 0} of {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next ▶
        </button>
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
