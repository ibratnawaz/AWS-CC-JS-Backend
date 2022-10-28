async function createProductTable(client) {
  await new Promise((resolve, reject) => {
    client.query(
      `create table products(
        id uuid not null default uuid_generate_v4() primary key,
        title text not null,
        description text,
        price numeric,
        thumbnail text
      )`,
      function (error) {
        if (error) {
          console.log('>>> Error', error);
          reject(error);
        }
        console.log('table products created!');
        resolve();
      }
    );
  });
}

module.exports.createProductTable = createProductTable;
