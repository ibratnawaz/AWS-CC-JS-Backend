const mysql = require('mysql')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

module.exports.createProduct = async (event, context) => {
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
        console.log('Connected as id ' + client.threadId)
        resolve(client.threadId)
      })
    })

    console.log('Inserting product...')
    await new Promise((resolve, reject) => {
      const { title, description, price, thumbnail, count } = JSON.parse(
        event.body
      )
      const id = uuidv4()
      client.query(
        `INSERT INTO products VALUES("${id}", "${title}", "${description}", "${price}", "${thumbnail}")`,
        function (error, results, fields) {
          if (error) {
            console.log('>>> Error', error)
            reject(error.stack)
          }
          if (results.affectedRows > 0) {
            client.query(
              `INSERT INTO stocks VALUES("${uuidv4()}", "${id}", "${count}")`,
              function (error, results, fields) {
                if (error) {
                  console.log('>>> Error', error)
                  reject(error.stack)
                }
                resolve(results)
              }
            )
          }
        }
      )
    })

    response = {
      statusCode: 200,
      body: JSON.stringify({ product: 'Product added successfully!' }),
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
  return {
    ...response,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  }
}
