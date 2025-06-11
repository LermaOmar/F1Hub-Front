import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GameLineUp from '../../../components/GameLineUp';
import MarketWidget from '../../../components/MarketWidget';
import axiosInstance from '../../../utils/AxiosInstance';
import { useAjaxErrorHandler } from '../../../hooks/AjaxErrorHandler';
import '../../../styles/GamePage.css';


const GamePage = () => {
  const { leagueId } = useParams();
  const [lineUp, setLineUp] = useState({ drivers: [], team: null });
  const [marketItems, setMarketItems] = useState([]);
    const { typedText, isErrorVisible, handleAjaxError } = useAjaxErrorHandler();


  useEffect(() => {
    if (!leagueId) return;

    axiosInstance.get(`/lineUps/${leagueId}/league/mine`)
      .then(res => setLineUp(res.data))
      .catch(handleAjaxError);

    axiosInstance.get(`/marketItems/${leagueId}/league`)
      .then(res => setMarketItems(res.data.content || []))
      .catch(handleAjaxError);
  }, [leagueId]);

  return (
    
    <div className="game-page">
      {isErrorVisible && <div className="error-notification">{typedText}</div>}
      <GameLineUp drivers={lineUp.drivers} team={lineUp.team} marketItems={marketItems} />
      <MarketWidget items={marketItems} leagueId={leagueId} />
    </div>
  );
};

export default GamePage;
