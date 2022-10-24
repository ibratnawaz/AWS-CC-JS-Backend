const mysql = require('mysql')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

const products = [
  {
    title: 'iPhone 13',
    description: 'An apple mobile which is nothing like apple',
    price: 549,
    count: 94,
    thumbnail: 'https://dummyjson.com/image/i/products/1/thumbnail.jpg',
  },
  {
    title: 'Samsung Universe 9',
    description:
      "Samsung's new variant which goes beyond Galaxy to the Universe",
    price: 1249,
    count: 36,
    thumbnail: 'https://dummyjson.com/image/i/products/3/thumbnail.jpg',
  },
  {
    title: 'HP Pavilion 15-DK1056WM',
    description:
      'HP Pavilion 15-DK1056WM Gaming Laptop 10th Gen Core i5, 8GB, 256GB SSD, GTX 1650 4GB, Windows 10',
    price: 1099,
    count: 89,
    thumbnail: 'https://dummyjson.com/image/i/products/10/thumbnail.jpeg',
  },
  {
    title: 'perfume Oil',
    description:
      'Mega Discount, Impression of Acqua Di Gio by GiorgioArmani concentrated attar perfume Oil',
    price: 13,
    count: 65,
    thumbnail: 'https://dummyjson.com/image/i/products/11/thumbnail.jpg',
  },
  {
    title: 'Handcraft Chinese style',
    description:
      'Handcraft Chinese style art luxury palace hotel villa mansion home decor ceramic vase with brass fruit plate',
    price: 60,
    count: 7,
    thumbnail: 'https://dummyjson.com/image/i/products/29/thumbnail.webp',
  },
  {
    title: 'Key Holder',
    description:
      'Attractive DesignMetallic materialFour key hooksReliable & DurablePremium Quality',
    price: 30,
    count: 54,
    thumbnail: 'https://dummyjson.com/image/i/products/30/thumbnail.jpg',
  },
]

async function insertProduct(client, product) {
  return new Promise((resolve, reject) => {
    const { title, description, price, thumbnail, count } = product
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
}

module.exports.insertFakeItemsInDB = async (event, context) => {
  console.log('Created database client!')
  const client = mysql.createConnection({
    host: process.env.AWS_RDS_ENDPOINT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectTimeout: 100,
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

    console.log('Seeding database...')

    for (let i = 0; i < products.length; i++) {
      await insertProduct(client, products[i])
    }

    response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Fake items inserted successfully!' }),
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
