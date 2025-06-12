import React, { useEffect, useState } from 'react';
import MVPCard from '../../../components/MvpCard';
import '../../../styles/Mvp.css';
import axiosInstance from '../../../utils/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAjaxErrorHandler } from '../../../hooks/AjaxErrorHandler';


const MVPPage = () => {
  const [teamMVP, setTeamMVP] = useState(null);
  const [driverMVPs, setDriverMVPs] = useState([]);

  const navigate = useNavigate()
  const { typedText, isErrorVisible, handleAjaxError } = useAjaxErrorHandler();

  useEffect(() => {

    axiosInstance.get('/teams/mvp')
      .then(response => {
        const id = response.data.id;
        return axiosInstance.get(`/teams/${id}`);
      })
      .then(response => setTeamMVP(response.data))
      .catch(handleAjaxError);

    axiosInstance.get('/drivers/mvps')
      .then(response => {
        const mvps = response.data.content || [];
        return Promise.all(
          mvps.map(driver => axiosInstance.get(`/drivers/${driver.id}`).then(res => res.data))
        );
      })
      .then(fullDrivers => setDriverMVPs(fullDrivers))
      .catch(handleAjaxError);
  }, []);



  return (
    <>
    
        <h1 className="mvp-title">GP MVP's</h1>
        <div className="header-controls">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
            </button>
        </div>
        {isErrorVisible && typedText && (
          <div className="error-notification">{typedText}</div>
        )}
        <section className="mvp-section">
            <h2 className="mvp-subtitle">Top Performers</h2>
            <div className="mvp-cards">
                {teamMVP && (
                <MVPCard
                    name={teamMVP.name}
                    image={teamMVP.imageUrl}
                    stats={{
                    Nationality: teamMVP.nationality,
                    Points: teamMVP.previousPoints,
                    Price: `$${teamMVP.price.toLocaleString()}`
                    }}
                />
                )}

                {driverMVPs.map(driver => (
                <MVPCard
                    key={driver.id}
                    name={driver.name}
                    image={driver.imageUrl}
                    stats={{
                    Nationality: driver.nationality,
                    Points: driver.previousPoints,
                    Price: `$${driver.price.toLocaleString()}`
                    }}
                />
                ))}
            </div>
        </section>
    </>

  );
};

export default MVPPage;
