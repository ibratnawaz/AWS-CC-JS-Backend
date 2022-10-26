const { Client } = require('pg');
require('dotenv').config();

const { createProductTable } = require('./db/create_products_table');
const { createStockTable } = require('./db/create_stocks_table');
const { dropAllTables } = require('./db/drop_all_tables');

module.exports.createTablesInDB = async (event, context) => {
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

    console.log('Creating tables for the database...');

    await dropAllTables(client);
    await createProductTable(client);
    await createStockTable(client);

    response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Tables created successfully!' }),
    };
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

  return response;
};
