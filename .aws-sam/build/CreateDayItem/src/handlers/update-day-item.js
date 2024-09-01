// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.DAY_TABLE;


/**
 * POST method to update one item to a DynamoDB table.
 */
exports.UpdateDayItem = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`UpdateDayItem only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    
    let response = {};

    // All log statements are written to CloudWatch
    console.info('received:', event);
    console.log(`${event.body}`)

    // Get id and title from the body of the request
    // Get id and title from the body of the request
    const body = JSON.parse(event.body);
    const id = event.pathParameters.id;
    const title = body.title;
    const description = body.description;
    const longDescription = body.longDescription;
    const category = body.category;

    try {
        const params = {
            TableName : tableName,
            Key: { id: id },
            ExpressionAttributeNames: {
                "#ID": "id", 
                "#T": "title",
                "#D": "description", 
                "#LD": "longDescription", 
                "#C": "category", 
               }, 
            ExpressionAttributeValues: {
                ":id": id,
                ":title": title,
                ":description": description,
                ":longDescription": longDescription,
                ":category": category,
            },
            UpdateExpression: 'SET #ID = :id, #T = :title, #D = :description, #LD = :longDescription, #C = :category',
            ReturnValues: "ALL_NEW"

        };
    
        const result = await docClient.update(params).promise();
    
        response = {
            statusCode: 200,
            body: `Day ${id} has been updated.`
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