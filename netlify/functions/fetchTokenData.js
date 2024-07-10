const axios = require('axios');
const faunadb = require('faunadb');

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY });

exports.handler = async function(event, context) {
  console.log('Function invoked');
  try {
    console.log('Fetching current data...');
    const currentDataResponse = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest', {
      params: { id: '31798' },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.REACT_APP_CMC_API_KEY,
      }
    });

    console.log('Current data fetched successfully');
    console.log('Current data:', JSON.stringify(currentDataResponse.data));

    const currentData = currentDataResponse.data.data['31798'];

    console.log('Storing data in FaunaDB...');
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
    console.log('Data stored in FaunaDB successfully');

    console.log('Fetching historical data from FaunaDB...');
    const historyResult = await client.query(
      q.Map(
        q.Paginate(
          q.Reverse(q.Match(q.Index('token_data_by_date'))),
          { size: 100 }
        ),
        q.Lambda('x', q.Get(q.Var('x')))
      )
    );
    console.log('Historical data fetched successfully');

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
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'An error occurred while fetching data',
        details: error.message,
        stack: error.stack
      })
    };
  }
}