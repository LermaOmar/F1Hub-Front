import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';

const MarketItemCard = ({ item, itemId, leagueId, myOffer, onCreateOffer, onEditOffer }) => {
  const [allOffers, setAllOffers] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`/offers/${leagueId}/league/${itemId}/item`)
      .then(res => setAllOffers(res.data))
      .catch(err => {
        console.error('❌ Error fetching all offers:', err);
        setAllOffers([]);
      });
  }, [itemId]);

  return (
    <div className="market-item-card">
      <img src={item.imageUrl} alt={item.name} className="market-item-image" />
      <div className="market-item-info">
        <strong>{item.name}</strong>
        <span className="market-item-sub">{item.type} – {item.nationality}</span>
        <span className="market-item-price">${item.price.toLocaleString()}</span>

        {myOffer ? (
          <div className="offer-info">
            <span>💰 Offer made: ${myOffer.amount.toLocaleString()}</span>
          </div>
        ) : (
          <div className="offer-info">
            <span>💰 No offer made</span>
          </div>
        )}

        <div className="offer-buttons">
          <button
            onClick={onCreateOffer}
            disabled={!!myOffer}
            className="make-offer-btn"
          >
            ➕
          </button>
          <button
            onClick={onEditOffer}
            disabled={!myOffer}
            className="edit-offer-btn"
          >
            ✏️
          </button>
        </div>

        {allOffers.length > 0 && (
          <div className="offers-list">
            <strong>Other Offers:</strong>
            <ul>
              {allOffers.map((offer) => (
                <li key={offer.id}>
                  ${offer.amount.toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketItemCard;
