const axios = require('axios');

exports.handler = async function(event, context) {
  console.log('Function invoked');
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest', {
      params: { id: '31798' },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.REACT_APP_CMC_API_KEY,
      }
    });

    console.log('Data fetched successfully');

    const tokenData = response.data.data['31798'];
    const currentPrice = tokenData.quote.USD.price;
    const priceChange24h = tokenData.quote.USD.percent_change_24h;

    // Calculate the price 24 hours ago
    const price24hAgo = currentPrice / (1 + priceChange24h / 100);

    return {
      statusCode: 200,
      body: JSON.stringify({
        currentPrice,
        price24hAgo,
        priceChange24h
      })
    };
  } catch (error) {
    console.error('Error in fetchTokenData:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'An error occurred while fetching data',
        details: error.message
      })
    };
  }
}