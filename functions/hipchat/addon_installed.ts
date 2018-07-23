import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import { AWSError, DynamoDB } from "aws-sdk";

export const addonInstalled: Handler = (
  event: APIGatewayEvent,
  context: Context,
  done: Callback
) => {
  const data = JSON.parse(event.body);

  const installItem: DynamoDB.Types.PutItemInput = {
    Item: {
      capabilitiesUrl: { S: data.capabilitiesUrl },
      groupId: { N: data.groupId.toString() },
      installedOn: { S: new Date(Date.now()).toISOString() },
      oauthId: { S: data.oauthId },
      oauthSecret: { S: data.oauthSecret },
      roomId: { N: data.roomId.toString() }
    },
    TableName: process.env.DYNAMODB_TABLE
  };

  const dyanmoDB = new DynamoDB();

  dyanmoDB.putItem(installItem, (error: AWSError) => {
    if (error) {
      done(new Error(`Unable to save install w/ error: ${error}`));

      return;
    }

    done(null, {
      body: JSON.stringify(installItem.Item),
      headers: {
        "content-type": "application/json"
      },
      statusCode: 200
    });
  });
};
