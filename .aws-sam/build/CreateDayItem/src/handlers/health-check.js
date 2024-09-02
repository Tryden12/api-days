
/**
 * GET method to check the status of the API-DAYS.
 */
exports.HealthCheck = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`GetAllDays only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    let response = {
        statusCode: 200,
        body: "Health successful with status code 200!"
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
