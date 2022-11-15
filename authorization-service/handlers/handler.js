require('dotenv').config();

module.exports = {
  basicAuthorizer: async (event, ctx, cb) => {
    if (event['type'] != 'TOKEN') {
      return cb('Unauthorized');
    }

    try {
      const authorizationToken = event.authorizationToken;
      const encodedCreds = authorizationToken.split(' ')[1];
      const buff = Buffer.from(encodedCreds, 'base64');
      const plainCreds = buff.toString('utf-8').split(':');
      const [userName, password] = plainCreds;

      const storedUserPassword = process.env[userName];
      const effect =
        !storedUserPassword || storedUserPassword !== password
          ? 'Deny'
          : 'Allow';

      console.log('>>> Username:', userName, ' Password:', password);

      const policy = generatePolicy(encodedCreds, event.methodArn, effect);

      return cb(null, policy);
    } catch (error) {
      return cb(`Unauthorized :${error.message}`);
    }
  },
};

function generatePolicy(principalId, resource, effect = 'Allow') {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    },
  };
}
