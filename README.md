# Shopping App Backend

## Setting up configuration and deploying the app

- git clone
- change region in serverless.yml
- run `sls deploy` to deploy the app to aws

You can login to aws console and and can verify the lambda function being created and running.

You can also goto the URL provided by the AWS Gateway API to fetch list of products.

### Note

- For self learning purpose I've created two different lambda module services.
- One for fetching the list of products
- Another for fetching the product by id

## Additional

- Enable Cross-origin access.
- Added swagger configuration to preview to the api more better. 