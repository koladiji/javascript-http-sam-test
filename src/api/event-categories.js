// Implementation of the API backend for checklists

const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const { metricScope } = require("aws-embedded-metrics");
const uuid = require("uuid");
ddbClient = new DynamoDB({});

const dynamo = DynamoDBDocument.from(ddbClient);
const catTableName = process.env.EVENT_CATEGORIES_TABLE;
const subCatTableName = process.env.EVENT_SUB_CATEGORIES_TABLE;

exports.handler = metricScope((metrics) => async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      // create new event-categories
      case "POST /api/event-categories":
        let requestJSON = JSON.parse(event.body);

        let id = uuid.v1();
        let newitem = {
          id,
          name: requestJSON.name,
          description: requestJSON.description,
          dateCreated: new Date().toISOString(),
        };

        // update the database
        await dynamo.put({
          TableName: catTableName,
          Item: newitem,
        });
        body = newitem;
        break;
      // Get all event-categories items
      case "GET /api/event-categories":
        // get data from the database
        body = await dynamo.scan({ TableName: catTableName });
        break;
      // create new event-categories
      case "POST /api/event-categories/{categoryId}/subcategories":
        let sub_catJSON = JSON.parse(event.body);

        let sub_cat_id = uuid.v1();
        let sub_cat_item = {
          id: sub_cat_id,
          categoryId: event.pathParameters.categoryId,
          name: sub_catJSON.name,
          description: sub_catJSON.description,
          dateCreated: new Date().toISOString(),
        };

        // update the database

        await dynamo.put({
          TableName: subCatTableName,
          Item: sub_cat_item,
        });
        body = sub_cat_item;
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
    headers,
  };
});
