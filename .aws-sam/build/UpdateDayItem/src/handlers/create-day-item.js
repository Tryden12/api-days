// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.DAY_TABLE;

/**
 * POST method to add one item to a DynamoDB table.
 */
exports.CreateDayItem = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`CreateDayItem only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and title from the body of the request
    const body = JSON.parse(event.body);
    const id = body.id;
    const title = body.title;
    const description = body.description;
    const longDescription = body.longDescription;
    const category = body.category;

    let response = {};

    try {
        const params = {
            TableName : tableName,
            Item: { 
                id : id, 
                title : title,
                description : description, 
                longDescription : longDescription, 
                category : category,
            }
        };
    
        const result = await docClient.put(params).promise();
    
        response = {
            statusCode: 200,
            body: `Day ${id} has been added successfully.`
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
