import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_KEY = '2c4cb2fe-3cba-4a67-8871-c30b46fd6eea';
const TOKEN_ID = '31798';

const TokenPerformance = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${TOKEN_ID}`, {
          headers: {
            'X-CMC_PRO_API_KEY': API_KEY,
          },
        });
        const price = response.data.data[TOKEN_ID].quote.USD.price;
        const newDataPoint = { name: new Date().toLocaleTimeString(), value: price };
        setChartData(prevData => [...prevData.slice(-5), newDataPoint]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 px-4 bg-gray-800">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-center text-teal-400">Token Performance</h3>
        <div className="bg-gray-700 rounded-lg shadow-xl p-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="name" stroke="#4FD1C5" />
              <YAxis stroke="#4FD1C5" />
              <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} />
              <Line type="monotone" dataKey="value" stroke="#4FD1C5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default TokenPerformance;
