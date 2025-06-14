import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../utils/AxiosInstance';
import '../../../styles/PointsAssignment.css';
import { useNavigate } from 'react-router-dom';

const calculatePoints = ({
  qualy,
  race,
  qualySprint,
  sprintRace,
  fastestLap,
  driverOfTheDay,
  grandChelem
}) => {
  let pts = 0;
  if (qualy >= 1 && qualy <= 5) pts += 6 - qualy;
  if (race >= 1 && race <= 14) pts += 16 - race;
  else if (race >= 15 && race <= 20) pts -= race - 14;
  if (qualySprint >= 1 && qualySprint <= 3) pts += 4 - qualySprint;
  if (sprintRace >= 1 && sprintRace <= 14) pts += 8 - sprintRace;
  else if (sprintRace >= 15 && sprintRace <= 20) pts -= sprintRace - 14;
  if (fastestLap) pts += 2;
  if (driverOfTheDay) pts += 2;
  if (grandChelem) pts += 5;
  return pts;
};

const DriverPointsAssignmentPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const typingRef = useRef(null);
  const navigate = useNavigate();

  const showError = (msg) => {
    if (typingRef.current) clearInterval(typingRef.current);
    setErrorMessage('');
    setIsErrorVisible(true);
    let idx = -1;
    const clean = msg.replace(/undefined/g, '').replace(/\n/g, ' ').trim();
    typingRef.current = setInterval(() => {
      setErrorMessage(prev => prev + clean[idx]);
      idx++;
      if (idx >= clean.length - 1) {
        clearInterval(typingRef.current);
        setTimeout(() => setIsErrorVisible(false), 3000);
      }
    }, 40);
  };

  useEffect(() => {
    axiosInstance.get('/drivers?skipNotActive=true&page=0&size=50')
      .then(res => {
        setDrivers(res.data.content);
        const init = {};
        res.data.content.forEach(d => {
          init[d.id] = {
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
        setAssignments(init);
      })
      .catch(err => {
        showError(err?.response?.data?.error || err.message);
        if ([401, 403].includes(err.response?.status)) navigate('/login');
      });
  }, [navigate]);

  const handleChange = (driverId, field, e) => {
    const isCheck = ['fastestLap', 'driverOfTheDay', 'grandChelem'].includes(field);
    const raw = isCheck ? e.target.checked : (parseInt(e.target.value, 10) || '');

    if (field === 'qualy' && raw !== '' && (raw < 1 || raw > drivers.length))
      return showError(`Qualy must be 1–${drivers.length}`);
    if (field === 'race' && raw !== '' && (raw < 1 || raw > drivers.length))
      return showError(`Race must be 1–${drivers.length}`);
    if (field === 'qualySprint' && raw !== '' && (raw < 1 || raw > drivers.length))
      return showError(`Q. Sprint must be 1–${drivers.length}`);
    if (field === 'sprintRace' && raw !== '' && (raw < 1 || raw > drivers.length))
      return showError(`Sprint Race must be 1–${drivers.length}`);
    if (field === 'grandChelem' && raw) {
      const current = assignments[driverId];
      if (!(current.qualy === 1 && current.race === 1 && current.fastestLap)) {
        return showError(
          '❌ To grant Grand Chelem the driver must be 1st in Qualy, 1st in Race and have the Fastest Lap'
        );
      }
    }

    setAssignments(prev => {
      const next = Object.fromEntries(
        Object.entries(prev).map(([id, a]) => [id, { ...a }])
      );
      const cur = { ...next[driverId], [field]: raw };

      if (field === 'driverOfTheDay' && raw) {
        Object.keys(next).forEach(id => {
          next[id].driverOfTheDay = id === String(driverId);
        });
      }
      if (field === 'fastestLap' && raw) {
        Object.keys(next).forEach(id => {
          next[id].fastestLap = id === String(driverId);
        });
      }
      if (cur.qualy === 1 && cur.race === 1 && cur.fastestLap) {
        cur.grandChelem = true;
      } else if (field !== 'grandChelem') {
        cur.grandChelem = false;
      }

      cur.points = calculatePoints(cur);
      next[driverId] = cur;
      return next;
    });
  };

  const handleMassSubmit = async () => {
    for (let d of drivers) {
      const a = assignments[d.id];
      if (a.qualy === '' || a.race === '') {
        return showError('⚠️ Qualy and Race required for every driver');
      }
      if ((a.qualySprint !== '' && a.sprintRace === '') ||
          (a.qualySprint === '' && a.sprintRace !== '')) {
        return showError('❌ Must fill both Q. Sprint and Sprint Race together');
      }
    }
    const cols = ['qualy', 'race', 'qualySprint', 'sprintRace'];
    for (let col of cols) {
      const seen = new Set();
      for (let d of drivers) {
        const v = assignments[d.id][col];
        if (v !== '' && seen.has(v)) {
          return showError(`❌ Duplicate ${col} value`);
        }
        if (v !== '') seen.add(v);
      }
    }
    const fastestLapCount = drivers.filter(d => assignments[d.id].fastestLap).length;
    if (fastestLapCount !== 1) {
      return showError('❌ You must select exactly one Fast Lap');
    }
    const mvpCount = drivers.filter(d => assignments[d.id].driverOfTheDay).length;
    if (mvpCount !== 1) {
      return showError('❌ You must select exactly one MVP');
    }
    try {
      await Promise.all(drivers.map(d =>
        axiosInstance.put(`/drivers/points/${d.id}`, null, { params: { points: assignments[d.id].points } })
      ));
      showError('✅ All points saved');
    } catch {
      showError('❌ Error saving points');
    }
  };

  return (
    <div className="assignment-page">
      <h2 className="points-title">Assign Drivers Points</h2>
      <div className="header-controls">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <button className="mass-submit-btn" onClick={handleMassSubmit}>
          💾 Save all
        </button>
      </div>
      {isErrorVisible && (
        <div className="error-notification">
          {errorMessage}
          <button className="close-btn" onClick={() => setIsErrorVisible(false)}>
            ❌
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
          </tr>
        </thead>
        <tbody>
          {drivers.map(d => {
            const a = assignments[d.id] || {};
            return (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>
                  <input
                    type="number"
                    className="points-input"
                    value={a.qualy}
                    onChange={e => handleChange(d.id, 'qualy', e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="points-input"
                    value={a.race}
                    onChange={e => handleChange(d.id, 'race', e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="points-input"
                    value={a.qualySprint}
                    onChange={e => handleChange(d.id, 'qualySprint', e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="points-input"
                    value={a.sprintRace}
                    onChange={e => handleChange(d.id, 'sprintRace', e)}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={a.driverOfTheDay}
                    onChange={e => handleChange(d.id, 'driverOfTheDay', e)}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={a.fastestLap}
                    onChange={e => handleChange(d.id, 'fastestLap', e)}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={a.grandChelem}
                    onChange={e => handleChange(d.id, 'grandChelem', e)}
                  />
                </td>
                <td className={a.points < 0 ? 'points-cell negative' : 'points-cell'}>
                  {a.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DriverPointsAssignmentPage;
