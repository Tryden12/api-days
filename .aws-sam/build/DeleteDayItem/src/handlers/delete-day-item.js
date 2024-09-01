// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const tableName = process.env.DAY_TABLE;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * DELETE method to add one item to a DynamoDB table.
 */
exports.DeleteDayItem = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        throw new Error(`DeleteDayItem only accepts DELETE method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and title from the body of the request
    const body = JSON.parse(event.body);
    const id = event.pathParameters.id;

    let response = {};

    try {
        const params = {
            TableName : tableName,
            Key: { id: id },
        };
    
        const result = await docClient.delete(params).promise();
    
        response = {
            statusCode: 200,
            body: `Day ${id} has been deleted from the DAY table.`
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
};
