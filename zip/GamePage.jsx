import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GameLineUp from '../../../components/GameLineUp';
import MarketWidget from '../../../components/MarketWidget';
import axiosInstance from '../../../utils/AxiosInstance';
import '../../../styles/GamePage.css';

const GamePage = () => {
  const { leagueId } = useParams();
  const [lineUp, setLineUp] = useState({ drivers: [], team: null });
  const [marketItems, setMarketItems] = useState([]);

  useEffect(() => {
    if (!leagueId) return;

    axiosInstance.get(`/lineUps/${leagueId}/league/mine`)
      .then(res => setLineUp(res.data))
      .catch(err => console.error('Error fetching lineup:', err));

    axiosInstance.get(`/marketItems/${leagueId}/league`)
      .then(res => setMarketItems(res.data.content || []))
      .catch(err => console.error('Error fetching market items:', err));
  }, [leagueId]);

  return (
    
    <div className="game-page">
      <GameLineUp drivers={lineUp.drivers} team={lineUp.team} marketItems={marketItems} />
      <MarketWidget items={marketItems} leagueId={leagueId} />
    </div>
  );
};

export default GamePage;
