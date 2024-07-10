import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const TokenDataContext = createContext();

export const useTokenData = () => useContext(TokenDataContext);

export const TokenDataProvider = ({ children }) => {
  const [tokenData, setTokenData] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [volumeHistory, setVolumeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('/.netlify/functions/fetchTokenData');
      const newData = response.data.data['31798'];
      setTokenData(newData);

      const timestamp = new Date().toLocaleTimeString();
      setPriceHistory(prev => [...prev, { time: timestamp, price: newData.quote.USD.price }]);
      setVolumeHistory(prev => [...prev, { time: timestamp, volume: newData.quote.USD.volume_24h }]);

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
    <TokenDataContext.Provider value={{ tokenData, priceHistory, volumeHistory, loading, error }}>
      {children}
    </TokenDataContext.Provider>
  );
};