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
      const { currentData, historicalData } = response.data;

      setTokenData(currentData.data['31798']);

      const historicalPrices = historicalData.data['31798'].quotes.map(quote => ({
        time: new Date(quote.timestamp).toLocaleDateString(),
        price: quote.quote.USD.price
      }));

      const historicalVolumes = historicalData.data['31798'].quotes.map(quote => ({
        time: new Date(quote.timestamp).toLocaleDateString(),
        volume: quote.quote.USD.volume_24h
      }));

      // Add the current data point
      const currentTimestamp = new Date().toLocaleDateString();
      historicalPrices.push({ time: currentTimestamp, price: currentData.data['31798'].quote.USD.price });
      historicalVolumes.push({ time: currentTimestamp, volume: currentData.data['31798'].quote.USD.volume_24h });

      setPriceHistory(historicalPrices);
      setVolumeHistory(historicalVolumes);

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