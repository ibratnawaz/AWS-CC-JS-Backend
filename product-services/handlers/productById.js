const { Client } = require('pg');
require('dotenv').config();

module.exports.getProductsById = async (event, context) => {
  console.log('Created database client!');
  const client = new Client({
    host: process.env.AWS_RDS_ENDPOINT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionTimeoutMillis: 10000,
  });

  let response;
  try {
    console.log('Connecting to database...');
    await new Promise((resolve, reject) => {
      client.connect(function (err) {
        if (err) {
          console.error(
            'Something went wrong while connecting to the database. Retry again to connect it.'
          );
          reject(err.stack);
        }
        console.log('Client connected successfully!');
        resolve();
      });
    });

    console.log('Fetching product...');
    const { id } = event.pathParameters;
    const res = await new Promise((resolve, reject) => {
      const sql = `select products.id, products.title, products.description, products.price, stocks.count, products.thumbnail from products join stocks on products.id = stocks.productsId where products.id = '${id}'`;
      client.query(sql, function (error, results) {
        if (error) {
          console.log('>>> Error', error);
          reject(error.message);
        }
        resolve(results.rows);
      });
    });

    if (!res.length) {
      response = {
        statusCode: 404,
        body: JSON.stringify({ message: 'Product not found!' }),
      };
    } else {
      response = {
        statusCode: 200,
        body: JSON.stringify({ product: res[0] }),
      };
    }
  } catch (error) {
    console.error('ERROR: ', error.message);
    response = {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  } finally {
    console.log('Closing database connection!');
    await client.end();
  }

  return {
    ...response,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
};
