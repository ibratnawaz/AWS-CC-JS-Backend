async function dropAllTables(client) {
  await new Promise((resolve, reject) => {
    client.query('DROP TABLE IF EXISTS stocks', (error, result) => {
      if (error) {
        console.log('>>> Error', error)
        reject(error.stack)
      }
      console.log('table dropped!')
      resolve(true)
    })
  })

  await new Promise((resolve, reject) => {
    client.query('DROP TABLE IF EXISTS products', (error, result) => {
      if (error) {
        console.log('>>> Error', error)
        reject(error.stack)
      }
      console.log('table dropped!')
      resolve(true)
    })
  })
}

module.exports.dropAllTables = dropAllTables
