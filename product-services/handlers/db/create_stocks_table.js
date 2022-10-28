async function createStockTable(client) {
  await new Promise((resolve, reject) => {
    client.query(
      `create table stocks(
        id uuid not null default uuid_generate_v4() primary key,
        productsId uuid not null references products(id) on delete cascade,
        count numeric NOT NULL
      )`,
      function (error, results) {
        if (error) {
          console.log('>>> Error', error);
          reject(error.stack);
        }
        console.log('table stocks created!');
        resolve();
      }
    );
  });
}

module.exports.createStockTable = createStockTable;
