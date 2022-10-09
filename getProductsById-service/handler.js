'use strict';
const products = require('./products.json');

module.exports.getProductsById = async (event) => {
  const { id } = event.pathParameters;
  const product = products.find((product) => id === product.id);

  if (product) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        results: 1,
        product
      })
    };
  } else {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        results: 'failed',
        message: `Product with id- ${id} does not exists.`
      })
    };
  }
};
