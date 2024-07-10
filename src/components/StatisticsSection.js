import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '2c4cb2fe-3cba-4a67-8871-c30b46fd6eea';
const TOKEN_ID = '31798';

const StatisticsSection = () => {
  const [stats, setStats] = useState([
    { label: 'Market Cap', value: '$0' },
    { label: 'Daily Volume', value: '$0' },
    { label: 'Liquidity', value: '$0' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${TOKEN_ID}`, {
          headers: {
            'X-CMC_PRO_API_KEY': API_KEY,
          },
        });
        const data = response.data.data[TOKEN_ID].quote.USD;
        setStats([
          { label: 'Market Cap', value: `$${data.market_cap.toLocaleString()}` },
          { label: 'Daily Volume', value: `$${data.volume_24h.toLocaleString()}` },
          { label: 'Liquidity', value: `$${(data.volume_24h / 2).toLocaleString()}` },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 px-4 bg-gray-900">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-center text-teal-400">
          Key Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-lg shadow-xl p-6 text-center transform hover:scale-105 transition duration-300">
              <h4 className="text-xl font-semibold mb-2 text-teal-300">{stat.label}</h4>
              <p className="text-3xl font-bold text-teal-400">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;