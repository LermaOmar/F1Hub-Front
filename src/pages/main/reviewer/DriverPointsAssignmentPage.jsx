import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../utils/AxiosInstance';
import '../../../styles/PointsAssignment.css';
import { useNavigate } from 'react-router-dom';

const calculatePoints = ({
  qualy,
  race,
  qualySprint,
  sprintRace,
  fastestLap = false,
  driverOfTheDay = false,
  grandChelem = false
}) => {
  let points = 0;

  if (qualy >= 1 && qualy <= 5) points += 6 - qualy;
  if (race >= 1 && race <= 14) points += 16 - race;
  else if (race >= 15 && race <= 20) points -= race - 14;

  if (qualySprint >= 1 && qualySprint <= 3) points += 4 - qualySprint;
  if (sprintRace >= 1 && sprintRace <= 14) points += 8 - sprintRace;
  else if (sprintRace >= 15 && sprintRace <= 20) points -= sprintRace - 14;

  if (fastestLap) points += 2;
  if (driverOfTheDay) points += 2;
  if (grandChelem) points += 5;

  return points;
};

const DriverPointsAssignmentPage = () => {
  const [drivers, setDrivers] = useState([]);
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

  const fetchDrivers = () => {
    axiosInstance
      .get(`/drivers?skipNotActive=true&page=0&size=50`)
      .then(response => {
        setDrivers(response.data.content);
        const initial = {};
        response.data.content.forEach(driver => {
          initial[driver.id] = {
            qualy: '',
            race: '',
            qualySprint: '',
            sprintRace: '',
            fastestLap: false,
            driverOfTheDay: false,
            grandChelem: false,
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
    fetchDrivers();
  }, []);

  const handleChange = (driverId, field, value) => {
    setAssignments(prev => {
      const current = { ...prev[driverId] };
      const newValue =
        field === 'fastestLap' || field === 'driverOfTheDay' || field === 'grandChelem'
          ? value.target.checked
          : parseInt(value.target.value) || '';

      const updated = {
        ...current,
        [field]: newValue
      };

      const driver = drivers.find(d => d.id === driverId);

      if (field === 'grandChelem' && newValue === true) {
        const { qualy, race, fastestLap } = updated;
        if (qualy !== 1 || race !== 1 || !fastestLap) {
          showTypingError(`❌ ${driver?.name || 'Driver'} can not receive Grand Chelem without being 1st on Qualy, Race, having the Fastest Lap and Leading every lap`);
          updated.grandChelem = false;
        }
      }

      if (
        ['qualy', 'race', 'fastestLap'].includes(field) &&
        current.grandChelem === true
      ) {
        const newQualy = field === 'qualy' ? newValue : current.qualy;
        const newRace = field === 'race' ? newValue : current.race;
        const newFL = field === 'fastestLap' ? newValue : current.fastestLap;

        if (newQualy !== 1 || newRace !== 1 || !newFL) {
          updated.grandChelem = false;
          showTypingError(`⚠️ Grand Chelem is no longuer available to ${driver?.name || 'a driver'} because he does not accomplish the required conditions`);
        }
      }

      return {
        ...prev,
        [driverId]: {
          ...updated,
          points: calculatePoints(updated)
        }
      };
    });
  };

  const handleSubmit = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    const points = assignments[driverId].points;

    axiosInstance
      .put(`/drivers/points/${driverId}`, null, {
        params: { points }
      })
      .then(() => showTypingError(`✅Points assigned to ${driver?.name}: ${points}`))
      .catch(() => showTypingError(`❌ Error assigning points to ${driver?.name}`));
  };

  const handleMassSubmit = async () => {
    const promises = Object.keys(assignments).map(driverId => {
      const points = assignments[driverId].points;
      return axiosInstance.put(`/drivers/points/${driverId}`, null, {
        params: { points }
      });
    });

    try {
      await Promise.all(promises);
      showTypingError('✅ Points assigned to all drivers');
    } catch (error) {
      showTypingError('❌ Error assigning points');
    }
  };

  return (
    <div className="assignment-page">
      <h2 className="points-title">Assign Drivers Points</h2>

      <div className="header-controls">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <button className="mass-submit-btn" onClick={handleMassSubmit}>💾 Save all</button>
      </div>

      {isErrorVisible && errorMessage && (
        <div className="error-notification">
          {errorMessage}
          <button className="close-btn" onClick={() => setIsErrorVisible(false)}>
            &times;
          </button>
        </div>
      )}

      <table className="points-table">
        <thead>
          <tr>
            <th>Driver</th>
            <th>Qualy</th>
            <th>Race</th>
            <th>Q. Sprint</th>
            <th>C. Sprint</th>
            <th>MVP</th>
            <th>Fast Lap</th>
            <th>Grand Chelem</th>
            <th>Points</th>
            <th>Save</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map(driver => {
            const a = assignments[driver.id] || {};
            return (
              <tr key={driver.id}>
                <td>{driver.name}</td>
                <td><input className="points-input" type="number" value={a.qualy || ''} onChange={(e) => handleChange(driver.id, 'qualy', e)} /></td>
                <td><input className="points-input" type="number" value={a.race || ''} onChange={(e) => handleChange(driver.id, 'race', e)} /></td>
                <td><input className="points-input" type="number" value={a.qualySprint || ''} onChange={(e) => handleChange(driver.id, 'qualySprint', e)} /></td>
                <td><input className="points-input" type="number" value={a.sprintRace || ''} onChange={(e) => handleChange(driver.id, 'sprintRace', e)} /></td>
                <td><input type="checkbox" className="points-checkbox" checked={a.driverOfTheDay || false} onChange={(e) => handleChange(driver.id, 'driverOfTheDay', e)} /></td>
                <td><input type="checkbox" className="points-checkbox" checked={a.fastestLap || false} onChange={(e) => handleChange(driver.id, 'fastestLap', e)} /></td>
                <td><input type="checkbox" className="points-checkbox" checked={a.grandChelem || false} onChange={(e) => handleChange(driver.id, 'grandChelem', e)} /></td>
                <td className={`points-cell ${a.points < 0 ? 'negative' : ''}`}>{a.points || 0}</td>
                <td><button className="points-button" onClick={() => handleSubmit(driver.id)}>Save</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DriverPointsAssignmentPage;
