[Demo App](https://d19xqitqyy78vv.cloudfront.net/)
### API details
base url: https://qlb8qzz86f.execute-api.ap-south-1.amazonaws.com
|End-point|Method|Description|
|:--------|:-----|:----------|
|/create-tables|GET|Drop all tables and re-create it|
|/db-seed|GET|db seeding with fake products|
|/products|GET|get list of all products|
|/products/create|POST|insert a new product|
|/products/{id}|GET|get a particular product using its id|

### Task Done
- using RDS instance instead fo DynamoDB tables
- created two tables products & stocks in the db
- created one to one relationship b/w the products and stocks tables to perform join operations.
- created lambda functions to perform following operation:
  - dropping & re-creating tables
  - db seeding with fake products
  - getting all products
  - inserting a new product
  - fetching a particular product by its id
- integrated the BE APIs with FE
- handled different server response status like:
  - 500- for internal server error when db fails or something went wrong
  - 404- when product not found
  - 200- for all successful status
- swagger added: [Swagger GUI for API](https://app.swaggerhub.com/apis/ibratnawaz/aws-rds-api/1.0.0-oas3#/default/get_products)
