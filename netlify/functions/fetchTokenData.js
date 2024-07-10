const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const response = await axios.get(process.env.REACT_APP_CMC_API_URL, {
      params: { id: '31798' },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.REACT_APP_CMC_API_KEY,
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: 422,
      body: String(error)
    };
  }
}