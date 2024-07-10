import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const TokenDataContext = createContext();

export const useTokenData = () => useContext(TokenDataContext);

export const TokenDataProvider = ({ children }) => {
  const [tokenData, setTokenData] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('/.netlify/functions/fetchTokenData');
      console.log('API Response:', response.data);

      const { currentPrice, price24hAgo, priceChange24h } = response.data;

      setTokenData({
        currentPrice,
        priceChange24h
      });

      // Create a 24-hour price history
      const now = new Date();
      const history = [];
      for (let i = 24; i >= 0; i--) {
        const time = new Date(now - i * 60 * 60 * 1000);
        const price = i === 0 ? currentPrice : price24hAgo + (currentPrice - price24hAgo) * (24 - i) / 24;
        history.push({ time: time.toLocaleTimeString(), price });
      }

      setPriceHistory(history);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'An error occurred while fetching data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <TokenDataContext.Provider value={{ tokenData, priceHistory, loading, error }}>
      {children}
    </TokenDataContext.Provider>
  );
};