async function dropAllTables(client) {
  await new Promise((resolve, reject) => {
    client.query('drop table if exists stocks', (error) => {
      if (error) {
        console.log('>>> Error', error);
        reject(error);
      }
      console.log('stocks table dropped!');
      resolve();
    });
  });

  await new Promise((resolve, reject) => {
    client.query('drop table if exists products', (error) => {
      if (error) {
        console.log('>>> Error', error);
        reject(error);
      }
      console.log('products table dropped!');
      resolve();
    });
  });
}

module.exports.dropAllTables = dropAllTables;
