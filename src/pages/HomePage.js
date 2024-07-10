import React from 'react';
import { useTokenData } from '../context/TokenDataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const HomePage = () => {
  const { tokenData, priceHistory, volumeHistory, loading, error } = useTokenData();

  if (loading) return <div className="text-center text-teal-400 my-10">Loading data...</div>;
  if (error) return <div className="text-center text-red-400 my-10">{error}</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="pt-16 md:pt-24 pb-8 md:pb-16 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-teal-400 glow">
            Revolutionize Your Investments with Jenner Token
          </h2>
          <p className="text-lg md:text-xl text-teal-200 mb-2 max-w-2xl mx-auto">
            Unlock the power of blockchain technology and experience unparalleled financial freedom with Jenner Token.
          </p>
          <p className="text-xs md:text-sm text-teal-300 mb-4 md:mb-8">
            CA: 0x482702745260ffd69fc19943f70cffe2cacd70e9
          </p>
          <button className="bg-teal-500 text-white font-bold py-2 md:py-3 px-4 md:px-8 rounded-lg hover:bg-teal-400 transition duration-300 transform hover:scale-105 glow">
            Get Started
          </button>
        </div>
      </section>

      {/* Current Price and 24h Change */}
      <section className="py-6 md:py-8 px-4 bg-gray-800">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-teal-400 glow">JENNER Token</h3>
          <p className="text-xl md:text-2xl font-bold text-teal-300">
            Current Price: ${tokenData.quote.USD.price.toFixed(6)}
            <span className={`ml-2 md:ml-4 ${tokenData.quote.USD.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {tokenData.quote.USD.percent_change_24h.toFixed(2)}% (24h)
            </span>
          </p>
        </div>
      </section>

      {/* Price Chart Section */}
      <section className="py-8 md:py-16 px-4 bg-gray-800" id="charts">
        <div className="container mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-teal-400 glow">
            JENNER Token Price Chart
          </h3>
          <div className="bg-gray-700 rounded-lg shadow-xl p-2 md:p-6">
            <ResponsiveContainer width="100%" height={300} minWidth={300}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="time" stroke="#4FD1C5" />
                <YAxis stroke="#4FD1C5" domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#1A202C', border: 'none', boxShadow: '0 0 10px rgba(79, 209, 197, 0.3)' }} />
                <Line type="monotone" dataKey="price" stroke="#4FD1C5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Volume Chart Section */}
      <section className="py-8 md:py-16 px-4 bg-gray-900" id="volume-chart">
        <div className="container mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-teal-400 glow">
            JENNER Token Volume Chart
          </h3>
          <div className="bg-gray-800 rounded-lg shadow-xl p-2 md:p-6">
            <ResponsiveContainer width="100%" height={300} minWidth={300}>
              <BarChart data={volumeHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="time" stroke="#4FD1C5" />
                <YAxis stroke="#4FD1C5" />
                <Tooltip contentStyle={{ background: '#1A202C', border: 'none', boxShadow: '0 0 10px rgba(79, 209, 197, 0.3)' }} />
                <Bar dataKey="volume" fill="#4FD1C5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-8 md:py-16 px-4 bg-gray-800" id="statistics">
        <div className="container mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-teal-400 glow">
            Key Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {[
              { label: 'Market Cap', value: `$${tokenData.quote.USD.market_cap.toLocaleString()}` },
              { label: 'Daily Volume', value: `$${tokenData.quote.USD.volume_24h.toLocaleString()}` },
              { label: 'Circulating Supply', value: tokenData.circulating_supply.toLocaleString() },
            ].map((stat, index) => (
              <div key={index} className="bg-gray-700 rounded-lg shadow-xl p-4 md:p-6 text-center">
                <h4 className="text-lg md:text-xl font-semibold mb-2 text-teal-300">{stat.label}</h4>
                <p className="text-xl md:text-3xl font-bold text-teal-400 glow">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;