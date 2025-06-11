import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/LeagueModal.css';

const LeagueModal = ({
  isOpen,
  onClose,
  type,
  errorMessage,
  newLeagueName,
  joinLeagueId,
  setNewLeagueName,
  setJoinLeagueId,
  handleCreateLeague,
  handleJoinLeague
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  if (!isOpen) return null;

  const modal = (
    <div className="modal">
      <div className="modal-content fadeIn">
        <h3>{type === 'create' ? 'Create League' : 'Join League'}</h3>

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        {type === 'create' ? (
          <>
            <input
              type="text"
              placeholder="League name"
              value={newLeagueName}
              onChange={(e) => setNewLeagueName(e.target.value)}
            />
            <button className="confirm-btn" onClick={handleCreateLeague}>✅ Create</button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="League ID"
              value={joinLeagueId}
              onChange={(e) => setJoinLeagueId(e.target.value)}
            />
            <button className="confirm-btn" onClick={handleJoinLeague}>✅ Join</button>
          </>
        )}

        <button className="close-btn" onClick={onClose}>❌ Close</button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export default LeagueModal;
