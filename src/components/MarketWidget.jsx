import React, { useEffect, useState } from 'react';
import MarketItemCard from './MarketItemCard';
import OfferModal from './OfferModal';
import axiosInstance from '../utils/AxiosInstance';
import {useAjaxErrorHandler} from '../hooks/AjaxErrorHandler'
const MarketWidget = ({ leagueId }) => {
  const [open, setOpen] = useState(false);
  const [marketItems, setMarketItems] = useState([]);
  const [myOffers, setMyOffers] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const { typedText, isErrorVisible, handleAjaxError } = useAjaxErrorHandler();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const marketRes = await axiosInstance.get(`/marketItems/${leagueId}/league`);
        const items = marketRes.data.content || [];
        console.log("items")
        console.log(marketRes.data.content)
        setMarketItems(items);

        const token = localStorage.getItem('auth_token');
        const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
        setUserId(payload?.user_id);

        const offerMap = {};
        await Promise.all(
          items.map(async ({ item }) => {
            try {
              const offerRes = await axiosInstance.get(`/offers/${leagueId}/league/${item.id}/item/mine`);
              offerMap[item.id] = offerRes.data;
            } catch (err) {
              if (err.response?.status === 204) offerMap[item.id] = null;
              else handleAjaxError(err)
            }
          })
        );
        setMyOffers(offerMap);
      } catch (err) {
        handleAjaxError(err)
      }
    };

    fetchData();
  }, [leagueId]);

  const handleSaveOffer = async (amount) => {
    const offer = myOffers[selectedItem.id];
    try {
      let res;
      if (offer) {
        res = await axiosInstance.put(`/offers/${offer.id}`, { amount });
      } else {
        const payload = {
          appUser: userId,
          amount,
          marketItem: selectedItem.id,
          league: leagueId,
        };
        res = await axiosInstance.post(`/offers`, payload);
      }
      setMyOffers((prev) => ({ ...prev, [selectedItem.id]: res.data }));
    } catch (err) {
      handleAjaxError(err)
    } finally {
      setModalOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="market-widget-wrapper">
        {isErrorVisible && typedText && (
          <div className="error-notification">{typedText}</div>
        )}
      <button className="toggle-btn" onClick={() => setOpen(!open)}>
        {open ? '▼' : '▲'}
      </button>

      <div className={`market-widget ${open ? 'open' : ''}`}>
        <h2 className="market-title">Marketplace</h2>
        <div className="market-content">
          {marketItems.length === 0 ? (
            <p className="empty-market">⚠️ No items available in the market</p>
          ) : (
            marketItems.map(({ id, item }) => (
              <MarketItemCard
                key={id}
                item={item}
                leagueId={leagueId}
                itemId={item.id}
                myOffer={myOffers[item.id]}
                onCreateOffer={() => {
                  setSelectedItem(item);
                  setModalOpen(true);
                }}
                onEditOffer={() => {
                  setSelectedItem(item);
                  setModalOpen(true);
                }}
              />
            ))
          )}
        </div>
      </div>

      {modalOpen && selectedItem && (
        <OfferModal
          item={{
            id: selectedItem.id,
            offerId: myOffers[selectedItem?.id]?.id
          }}
          editing={!!myOffers[selectedItem.id]}
          leagueId={leagueId}
          onClose={() => {
            setModalOpen(false);
            setSelectedItem(null);
          }}

        />
      )}
    </div>
  );
};

export default MarketWidget;
