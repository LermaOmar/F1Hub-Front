import React from 'react';
import '../styles/Mvp.css';

const MVPCard = ({ name, image, stats = {} }) => {
  return (
    <div className="mvp-card">
      <div className="card-background">
        <img src={image} alt={name} className="player-image" />
        <div className="card-overlay">
          <h3 className="player-name">{name}</h3>
          <ul className="player-stats">
            {Object.entries(stats).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MVPCard;
