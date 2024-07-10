import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const TokenDataContext = createContext();

export const useTokenData = () => useContext(TokenDataContext);

export const TokenDataProvider = ({ children }) => {
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const cachedData = localStorage.getItem('tokenData');
      const cachedTimestamp = localStorage.getItem('tokenDataTimestamp');
      
      if (cachedData && cachedTimestamp) {
        const currentTime = new Date().getTime();
        if (currentTime - parseInt(cachedTimestamp) < 300000) { // 5 minutes
          setTokenData(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
      }

      const response = await axios.get('/.netlify/functions/fetchTokenData');
      const newData = response.data.data['31798'];
      setTokenData(newData);
      localStorage.setItem('tokenData', JSON.stringify(newData));
      localStorage.setItem('tokenDataTimestamp', new Date().getTime().toString());
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <TokenDataContext.Provider value={{ tokenData, loading, error }}>
      {children}
    </TokenDataContext.Provider>
  );
};