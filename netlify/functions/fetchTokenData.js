const axios = require('axios');
const faunadb = require('faunadb');

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY });

exports.handler = async function(event, context) {
  console.log('Function invoked');
  try {
    // Fetch current data
    const currentDataResponse = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest', {
      params: { id: '31798' },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.REACT_APP_CMC_API_KEY,
      }
    });

    console.log('Current data fetched successfully');

    const currentData = currentDataResponse.data.data['31798'];

    // Store current data in FaunaDB
    await client.query(
      q.Create(
        q.Collection('token_data'),
        {
          data: {
            date: new Date().toISOString(),
            price: currentData.quote.USD.price,
            volume: currentData.quote.USD.volume_24h
          }
        }
      )
    );

    // Fetch historical data from FaunaDB
    const historyResult = await client.query(
      q.Map(
        q.Paginate(
          q.Reverse(q.Match(q.Index('token_data_by_date'))),
          { size: 100 }
        ),
        q.Lambda('x', q.Get(q.Var('x')))
      )
    );

    const historicalData = historyResult.data.map(item => item.data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        currentData: currentDataResponse.data,
        historicalData: historicalData
      })
    };
  } catch (error) {
    console.error('Error in fetchTokenData:', error);
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ 
        error: 'An error occurred while fetching data',
        details: error.message
      })
    };
  }
}