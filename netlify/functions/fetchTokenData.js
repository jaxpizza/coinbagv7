const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const currentDataResponse = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest', {
      params: { id: '31798' },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.REACT_APP_CMC_API_KEY,
      }
    });

    const historicalDataResponse = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/historical', {
      params: { 
        id: '31798',
        time_start: '2023-01-01', // Adjust this date as needed
        interval: '1d' // Daily intervals
      },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.REACT_APP_CMC_API_KEY,
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        currentData: currentDataResponse.data,
        historicalData: historicalDataResponse.data
      })
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      statusCode: 422,
      body: JSON.stringify({ error: 'An error occurred while fetching data' })
    };
  }
}