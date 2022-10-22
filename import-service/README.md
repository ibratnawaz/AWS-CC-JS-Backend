### API details

base url: https://jwia7ettz7.execute-api.ap-south-1.amazonaws.com/parse

| End-point                         | Method | Payload                                     | Description                            |
| :-------------------------------- | :----- | :------------------------------------------ | :------------------------------------- |
| /import/{filename-with-extension} | PUT    | file                                        | Upload excel file to S3 bucket         |
| /parse                            | POST   | json data: {"key":"[uploaded-file-s3-key]"} | parse the already uploaded excel sheet |

### Task Done

- Created the two different services in the backend folder
  - ```backend-repository
      product-service
      import-service
    ```
- Create a lambda function called `importProductsFile` to upload the excel file to S3 bucket.
- Proper validation is added to only upload `.xlsx` type file, for different file type a proper error message is returned
- Create another lambda function called `importFileParser` which parse the file whose key is provided.
- The lambda function also move the file from the `uploaded` folder into the `parsed` folder (move the file means that file should be copied into a new folder in the same bucket called parsed, and then deleted from uploaded folder).
- `async/await` is used wherever it is required
- different status code like 500, 405, 200 is used wherever it is required
- [Demo Video](https://epam-my.sharepoint.com/:v:/p/ibrat_nawaz/EaToauZJ5bFIiD3NI1a3GVYBBsRwDj5xdrxuRLCldEvF8A?e=hRTdM4)
- showing the data stream while parsing
  ![parsing-result](https://user-images.githubusercontent.com/51021308/197342633-72bac0b7-0180-4941-be83-8274498098c9.png)
