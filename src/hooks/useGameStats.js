// src/hooks/useGameStats.js
import { useState, useEffect } from 'react';
import apiService from '../../../backend/src/services/api';

export const useGameStats = (childId) => {
  const [stats, setStats] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (childId) {
      fetchStats();
    }
  }, [childId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [statsData, recentData] = await Promise.all([
        apiService.getGameStats(childId),
        apiService.getRecentGames(childId)
      ]);
      
      setStats(statsData.data);
      setRecentGames(recentData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { stats, recentGames, loading, error, refresh: fetchStats };
};