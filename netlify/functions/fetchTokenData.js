const axios = require('axios');

exports.handler = async function(event, context) {
  console.log('Function invoked');
  try {
    console.log('API Key:', process.env.REACT_APP_CMC_API_KEY ? 'Present' : 'Missing');
    
    const currentDataResponse = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest', {
      params: { id: '31798' },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.REACT_APP_CMC_API_KEY,
      }
    });

    console.log('Current data fetched successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({
        currentData: currentDataResponse.data
      })
    };
  } catch (error) {
    console.error('Error in fetchTokenData:', JSON.stringify({
      message: error.message,
      response: error.response ? {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers
      } : 'No response',
      config: error.config ? {
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers
      } : 'No config'
    }));

    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ 
        error: 'An error occurred while fetching data',
        details: error.response ? error.response.data : error.message
      })
    };
  }
}