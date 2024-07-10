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

      if (historicalData && historicalData.data && historicalData.data['31798'] && historicalData.data['31798'].quotes) {
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
      } else {
        console.warn('Historical data is missing or in an unexpected format');
        // Use only current data if historical data is not available
        setPriceHistory([{ time: new Date().toLocaleDateString(), price: currentData.data['31798'].quote.USD.price }]);
        setVolumeHistory([{ time: new Date().toLocaleDateString(), volume: currentData.data['31798'].quote.USD.volume_24h }]);
      }

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