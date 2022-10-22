'use strict';
const AWS = require('aws-sdk');
const S3_BuCKET_NAME = 'aws-uploaded';
module.exports = {
  importProductsFile: async (event) => {
    const fileName = event.queryStringParameters.name ?? `default.csv`;
    console.log(event);
    let response = {};
    const s3 = new AWS.S3({ region: 'ap-south-1' });
    return {
      ...response,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  },
};
