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

      const { currentData, historicalData } = response.data;

      if (!currentData || !currentData.data || !currentData.data['31798']) {
        throw new Error('Invalid current data structure received from API');
      }

      setTokenData(currentData.data['31798']);

      const updatedPriceHistory = [
        ...historicalData.map(item => ({ time: new Date(item.date).toLocaleDateString(), price: item.price })),
        { time: new Date().toLocaleDateString(), price: currentData.data['31798'].quote.USD.price }
      ];

      const updatedVolumeHistory = [
        ...historicalData.map(item => ({ time: new Date(item.date).toLocaleDateString(), volume: item.volume })),
        { time: new Date().toLocaleDateString(), volume: currentData.data['31798'].quote.USD.volume_24h }
      ];

      setPriceHistory(updatedPriceHistory);
      setVolumeHistory(updatedVolumeHistory);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        request: err.request
      });
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