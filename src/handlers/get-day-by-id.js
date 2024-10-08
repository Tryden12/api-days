// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const tableName = process.env.DAY_TABLE;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * GET method to get one item by id from a DynamoDB table.
 */
exports.GetDayById = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`GetDayById only accept GET method, you tried: ${event.httpMethod}`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);
 
  // Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
  const id = event.pathParameters.id;
 
  let response = {};

  try {
    const params = {
      TableName : tableName,
      Key: { id: id },
    };
    const data = await docClient.get(params).promise();
    const item = data.Item;
   
    response = {
      statusCode: 200,
      body: JSON.stringify(item)
    };
  } catch (ResourceNotFoundException) {
    response = {
        statusCode: 404,
        body: "Unable to call DynamoDB. Table resource not found."
    };
  }
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
