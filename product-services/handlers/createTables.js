const mysql = require('mysql')
require('dotenv').config()

const { createProductTable } = require('./db/create_products_table')
const { createStockTable } = require('./db/create_stocks_table')
const { dropAllTables } = require('./db/drop_all_tables')

module.exports.createTablesInDB = async (event, context) => {
  console.log('Created database client!')
  const client = mysql.createConnection({
    host: process.env.AWS_RDS_ENDPOINT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectTimeout: 10,
  })

  let response
  try {
    console.log('Connecting to database...')
    await new Promise((resolve, reject) => {
      client.connect(function (err) {
        if (err) {
          console.error(
            'Something went wrong while connecting to the database. Retry again to connect it.'
          )
          reject(err.stack)
        }
        console.log('Connected to db as id ' + client.threadId)
        resolve(client.threadId)
      })
    })

    console.log('Creating tables for the database...')

    await dropAllTables(client)
    await createProductTable(client)
    await createStockTable(client)

    response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Tables created successfully!' }),
    }
  } catch (error) {
    console.error(error)
    response = {
      statusCode: 500,
      body: JSON.stringify(error.message),
    }
  } finally {
    console.log('Closing database connection!')
    await client.end()
  }

  console.log(response)
  return response
}
