'use strict';
const AWS = require('aws-sdk');
const csv = require('csv-parser');
const S3_BuCKET_NAME = 'aws-uploaded';

module.exports = {
  importProductsFile: async (event) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    };
    const fileType = event.headers['content-type'];
    console.log('>>> file extension', fileType);
    if (!fileType.includes('spreadsheetml')) {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Only .xlsx file type is allowed!' }),
        headers,
      };
    }

    const fileName = event.pathParameters.filename || 'default.xlsx';
    const decodedFile = Buffer.from(event.body, 'base64');
    const params = {
      Bucket: S3_BuCKET_NAME,
      Key: `uploaded/${fileName}`,
      Body: decodedFile,
      ContentType: fileType,
    };

    let response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully uploaded the file to S3' }),
    };

    try {
      const s3 = new AWS.S3({ region: 'ap-south-1' });
      const uploadResult = await s3.upload(params).promise();
      response.body = JSON.stringify({
        message: 'Successfully uploaded the file to S3',
        signedURL: uploadResult.Location,
        key: uploadResult.Key,
        id: uploadResult.ETag,
      });
    } catch (error) {
      console.log(error);
      response = {
        statusCode: 500,
        body: JSON.stringify({ message: 'Something went wrong!' }),
      };
    }

    return {
      ...response,
      headers,
    };
  },
  importFileParser: async (event) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    };

    let response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully parsed the file to S3' }),
    };

    try {
      const key = JSON.parse(event.body).key;
      const s3 = new AWS.S3({ region: 'ap-south-1' });
      const params = {
        Bucket: S3_BuCKET_NAME,
        Key: key,
      };

      const stream = await s3.getObject(params).createReadStream();
      stream
        .pipe(csv())
        .on('data', (data) => {
          console.log('>>> streaming data', data);
        })
        .on('error', (error) => console.log('>>> stream error', error))
        .on('end', () => console.log('streaming is completed!'));

      const copyParams = {
        Bucket: S3_BuCKET_NAME,
        CopySource: `${S3_BuCKET_NAME}/${key}`,
        Key: key.replace('uploaded', 'parsed'),
      };
      await s3.copyObject(copyParams).promise();

      const deleteParams = {
        Bucket: S3_BuCKET_NAME,
        Key: key,
      };
      await s3.deleteObject(deleteParams).promise();
    } catch (error) {
      console.log(error);
      response = {
        statusCode: 500,
        body: JSON.stringify({ message: 'Something went wrong!' }),
      };
    }

    return {
      ...response,
      headers,
    };
  },
};
