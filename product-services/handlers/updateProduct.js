const { Client } = require('pg');
require('dotenv').config();

async function updateHandler(client, id, product) {
  const { title, description, price, thumbnail, count } = product;

  const productsSql = `update products set title='${title}', description='${description}', price=${price}, thumbnail='${thumbnail}' where id = '${id}'`;
  const stockSql = `update stocks set count=${count} where productsid = '${id}'`;
  const productDetailsUpdate = new Promise((resolve, reject) => {
    client.query(productsSql, (error, results) => {
      if (error) {
        console.log(
          '>>> Error: pre checking before updating product details',
          error
        );
        reject(error.stack);
      }
      resolve('product updated successfully!');
    });
  });

  const productCountUpdate = new Promise((resolve, reject) => {
    client.query(stockSql, (error, results) => {
      if (error) {
        console.log(
          '>>> Error: pre checking before updating product count',
          error
        );
        reject(error.stack);
      }
      resolve('product updated successfully!');
    });
  });

  return Promise.all([productDetailsUpdate, productCountUpdate]);
}

module.exports.updateProduct = async (event, context) => {
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
          reject(err);
        }
        console.log('Client connected successfully!');
        resolve();
      });
    });

    console.log('Updating product...');
    await updateHandler(
      client,
      event.pathParameters.id,
      JSON.parse(event.body)
    );

    response = {
      statusCode: 200,
      body: JSON.stringify({ product: 'Product updated successfully!' }),
    };
  } catch (error) {
    console.error(error);
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
