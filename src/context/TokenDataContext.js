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
      console.log('API Response:', response.data);

      const { currentData } = response.data;

      if (!currentData || !currentData.data || !currentData.data['31798']) {
        throw new Error('Invalid current data structure received from API');
      }

      setTokenData(currentData.data['31798']);

      const currentTimestamp = new Date().toLocaleDateString();
      setPriceHistory(prev => [...prev, { time: currentTimestamp, price: currentData.data['31798'].quote.USD.price }]);
      setVolumeHistory(prev => [...prev, { time: currentTimestamp, volume: currentData.data['31798'].quote.USD.volume_24h }]);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.error || err.message || 'An error occurred while fetching data');
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