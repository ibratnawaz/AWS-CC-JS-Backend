async function createStockTable(client) {
  await new Promise((resolve, reject) => {
    client.query(
      'CREATE TABLE stocks(id VARCHAR(50) NOT NULL, productsId VARCHAR(50) NOT NULL, count INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (productsId) REFERENCES products(id) ON DELETE CASCADE)',
      function (error, results, fields) {
        if (error) {
          console.log('>>> Error', error)
          reject(error.stack)
        }
        console.log('table stocks created!')
        resolve(results)
      }
    )
  })
}

module.exports.createStockTable = createStockTable
