import React, { useState } from 'react';
import MVPCard from './MvpCard';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/AxiosInstance';

const GameLineUp = ({ drivers = [], team, marketItems = [] }) => {
  const navigate = useNavigate();
  const { leagueId } = useParams();
  const [offersModal, setOffersModal] = useState({ open: false, offers: [], item: null });

  // 🔁 Ordenamos los drivers por ID
  const sortedDrivers = [...drivers].sort((a, b) => a.id - b.id);

  const isInMarket = (item) =>
    marketItems.some((marketEntry) => marketEntry.item.id === item.id);

  const handleToggleMarket = async (item) => {
    const inMarket = isInMarket(item);
    const action = inMarket ? 'hide' : 'display';
    try {
      await axiosInstance.put(`/marketItems/${item.id}/${action}`, {
        id: Number(leagueId)
      });
      window.location.reload();
    } catch (error) {
      console.error(`❌ Error trying to ${action} item:`, error);
    }
  };

  const handleViewOffers = async (item) => {
    if (offersModal.open && offersModal.item?.id === item.id) {
      // 🔄 Toggle off if it's the same item
      return setOffersModal({ open: false, offers: [], item: null });
    }

    try {
      const res = await axiosInstance.get(`/offers/${leagueId}/market-item/${item.id}/offers`);
      setOffersModal({ open: true, offers: res.data, item });
    } catch (err) {
      console.error('Error fetching offers:', err);
      setOffersModal({ open: true, offers: [], item });
    }
  };

  const renderCardWithActions = (item) => {
    const inMarket = isInMarket(item);

    return (
      <div className="card-wrapper" key={item.id}>
        <MVPCard
          name={item.name}
          image={item.imageUrl}
          stats={{
            Nationality: item.nationality,
            Price: `$${item.price.toLocaleString()}`
          }}
        />
        <div className="lineup-actions">
          <button className="lineup-btn" onClick={() => handleToggleMarket(item)}>
            {inMarket ? '❌ Hide from Market' : '📤 Display in Market'}
          </button>
          <button className="lineup-btn" onClick={() => handleViewOffers(item)}>
            🔍 View Offers
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="game-lineup">
      <div className="header-controls">
        <button className="back-btn" onClick={() => navigate('/player/leagues')}>
          ← Back to Leagues
        </button>
      </div>

      <h2 className="section-title">🏎️ Your LineUp</h2>
      <div className="lineup-cards">
        {sortedDrivers.map(renderCardWithActions)}
        {team && renderCardWithActions(team)}
      </div>

      {offersModal.open && (
        <div className="offers-modal">
          <div className="modal-content">
            <h3>Offers for {offersModal.item.name}</h3>
            {offersModal.offers.length > 0 ? (
              <ul>
                {offersModal.offers.map((offer) => (
                  <li key={offer.id}>
                    ${offer.amount.toLocaleString()} – by {offer.user?.username || 'Anonymous'}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No offers yet for this item.</p>
            )}
            <button onClick={() => setOffersModal({ open: false, offers: [], item: null })}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};


export default GameLineUp;
