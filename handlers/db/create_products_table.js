async function createProductTable(client) {
  await new Promise((resolve, reject) => {
    client.query(
      'CREATE TABLE products(id VARCHAR(50) NOT NULL, title TEXT(255) NOT NULL, description TEXT(255), price INT, thumbnail TEXT(255), PRIMARY KEY (id))',
      function (error, results, fields) {
        if (error) {
          console.log('>>> Error', error)
          reject(error.stack)
        }
        console.log('table products created!')
        resolve(results)
      }
    )
  })
}

module.exports.createProductTable = createProductTable
