import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../utils/AxiosInstance';
import '../../../styles/PointsAssignment.css';
import { useNavigate } from 'react-router-dom';

const TeamPointsAssignmentPage = () => {
  const [teams, setTeams] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const typingRef = useRef(null);
  const navigate = useNavigate();

  const showTypingError = (text) => {
    if (!text || typeof text !== 'string') return;
    const clean = text.replace(/undefined/g, '').replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim();

    if (typingRef.current) clearInterval(typingRef.current);
    setErrorMessage('');
    setIsErrorVisible(true);

    let index = -1;
    typingRef.current = setInterval(() => {
      setErrorMessage((prev) => prev + clean[index]);
      index++;
      if (index >= clean.length-1) {
        clearInterval(typingRef.current);
        setTimeout(() => {
          setIsErrorVisible(false);
          setErrorMessage('');
        }, 3000);
      }
    }, 40);
  };

  const fetchTeams = () => {
    axiosInstance
      .get('/teams?skipNotActive=true&page=0&size=50')
      .then(response => {
        setTeams(response.data.content);
        const initial = {};
        response.data.content.forEach(team => {
          initial[team.id] = {
            driver1Position: '',
            driver2Position: '',
            points: 0
          };
        });
        setAssignments(initial);
      })
      .catch(error => {
        showTypingError(error?.response?.data?.error || error.message || 'Unexpected error occurred');
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        }
      });
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleChange = (teamId, field, value) => {
    setAssignments(prev => {
      const updatedAssignments = {
        ...prev,
        [teamId]: {
          ...prev[teamId],
          [field]: parseInt(value.target.value) || ''
        }
      };

      const completeTeams = Object.entries(updatedAssignments)
        .filter(([_, val]) => val.driver1Position && val.driver2Position)
        .map(([id, val]) => {
          const media = (val.driver1Position + val.driver2Position) / 2;
          return { teamId: id, media };
        });

      completeTeams.sort((a, b) => a.media - b.media);

      const scale = (n) => {
        const step = 12 / Math.max(n - 1, 1);
        return Array.from({ length: n }, (_, i) => Math.round(6 - i * step));
      };

      const dynamicPoints = scale(completeTeams.length);
      const newAssignments = { ...updatedAssignments };

      completeTeams.forEach((entry, index) => {
        newAssignments[entry.teamId].points = dynamicPoints[index];
      });

      Object.entries(newAssignments).forEach(([id, val]) => {
        if (!val.driver1Position || !val.driver2Position) {
          newAssignments[id].points = 0;
        }
      });

      return newAssignments;
    });
  };

  const handleMassSubmit = async () => {
    const allPositions = [];

    for (const a of Object.values(assignments)) {
      if (!a.driver1Position || !a.driver2Position) {
        showTypingError('❌ All teams must have both driver positions assigned.');
        return;
      }
      allPositions.push(a.driver1Position, a.driver2Position);
    }

    const maxPos = teams.length * 2;
    const invalid = allPositions.some(pos => pos < 1 || pos > maxPos);
    if (invalid) {
      showTypingError(`❌ Positions must be between 1 and ${maxPos}.`);
      return;
    }

    const positionSet = new Set();
    for (const pos of allPositions) {
      if (positionSet.has(pos)) {
        showTypingError(`❌ Duplicate position detected: ${pos}`);
        return;
      }
      positionSet.add(pos);
    }

    try {
      await Promise.all(Object.entries(assignments).map(([teamId, data]) =>
        axiosInstance.put(`/teams/points/${teamId}`, null, {
          params: { points: data.points }
        })
      ));
      showTypingError('✅ Points successfully assigned to all teams.');
    } catch (error) {
      showTypingError('❌ Failed to assign points.');
    }
  };

  return (
    <div className="assignment-page">
      <h2 className="points-title">Assign Teams Points</h2>

      <div className="header-controls">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
        <button className="mass-submit-btn" onClick={handleMassSubmit}>💾 Save All</button>
      </div>

      {isErrorVisible && errorMessage && (
        <div className="error-notification">
          {errorMessage}
          <button className="close-btn" onClick={() => setIsErrorVisible(false)}>❌</button>
        </div>
      )}

      <table className="points-table">
        <thead>
          <tr>
            <th>Team</th>
            <th>Driver 1 Position</th>
            <th>Driver 2 Position</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => {
            const a = assignments[team.id] || {};
            return (
              <tr key={team.id}>
                <td>{team.name}</td>
                <td>
                  <input
                    className="points-input"
                    type="number"
                    min="1"
                    max={teams.length * 2}
                    value={a.driver1Position || ''}
                    onChange={(e) => handleChange(team.id, 'driver1Position', e)}
                  />
                </td>
                <td>
                  <input
                    className="points-input"
                    type="number"
                    min="1"
                    max={teams.length * 2}
                    value={a.driver2Position || ''}
                    onChange={(e) => handleChange(team.id, 'driver2Position', e)}
                  />
                </td>
                <td className={`points-cell ${a.points < 0 ? 'negative' : ''}`}>{a.points || 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TeamPointsAssignmentPage;
