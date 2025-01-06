// Implementation of the API backend for checklists

const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const { metricScope } = require("aws-embedded-metrics");
const uuid = require("uuid");
ddbClient = new DynamoDB({});

const dynamo = DynamoDBDocument.from(ddbClient);
const tableName = process.env.CHECKLISTS_TABLE;

exports.handler = metricScope(metrics => async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    switch (event.routeKey) {
      // create new checklist
      case "POST /api/checklists":
        let requestJSON = JSON.parse(event.body);
        
        let id = uuid.v1();
        let newitem = {
          id,
          name: requestJSON.name,
          description: requestJSON.description,
          dateCreated: new Date().toISOString()
        }
        
        // update the database
        await dynamo
          .put({
            TableName: tableName,
            Item: newitem
          });
        body = newitem;
        break;
      // Get all checklist items
      case "GET /api/checklists":
        // get data from the database
        body = await dynamo.scan({ TableName: tableName });
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
    console.error(err.message);
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
});
