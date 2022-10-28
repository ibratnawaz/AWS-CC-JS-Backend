const { Client } = require('pg');
require('dotenv').config();

async function insertProduct(client, product) {
  return await new Promise((resolve, reject) => {
    const { title, description, price, thumbnail, count } = product;
    client.query(
      `select * from products where title = '${title}'`,
      (error, results) => {
        if (error) {
          console.log('>>> Error: pre checking before insertion', error);
          reject(error.stack);
        }
        if (!results.rows.length) {
          client.query(
            `insert into products (title, description, price, thumbnail) values('${title}', '${description}', '${price}', '${thumbnail}') returning id`,
            function (error, results) {
              if (error) {
                console.log('>>> Error: products table', error);
                reject(error.stack);
              }
              if (results.rows.length > 0) {
                client.query(
                  `insert into stocks (productsId, count) values('${results.rows[0].id}', '${count}')`,
                  function (error) {
                    if (error) {
                      console.log('>>> Error: stocks table', error);
                      reject(error.stack);
                    }
                    resolve('product inserted successfully!');
                  }
                );
              }
            }
          );
        } else {
          resolve();
        }
      }
    );
  });
}

module.exports.createProduct = async (event, context) => {
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

    console.log('Inserting product...');
    if ('Records' in event) {
      await insertProduct(client, JSON.parse(event.Records[0].body));
    } else {
      await insertProduct(client, JSON.parse(event.body));
    }

    response = {
      statusCode: 200,
      body: JSON.stringify({ product: 'Product added successfully!' }),
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
