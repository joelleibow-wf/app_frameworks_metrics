import BigQuery from "@google-cloud/bigquery";

import { APIGatewayEvent, Handler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { config } from "dotenv";
import { verify } from "jsonwebtoken";

import { RoomMessageEventResource } from "../../libs/hipchat/resources/room";
import { InstallableService } from "../../libs/hipchat/services/installable";

export const supportMessageReceived: Handler = async (
  event: APIGatewayEvent
) => {
  config();

  const roomMessageEvent: RoomMessageEventResource = JSON.parse(event.body);
  const installableService = new InstallableService();
  const installItem: DynamoDB.Types.GetItemOutput = await installableService.get(
    roomMessageEvent.oauth_client_id
  );

  try {
    verify(
      event.headers.Authorization.replace(/(JWT)\s/, ""),
      installItem.Item.oauthSecret.S
    );

    const eventItem = roomMessageEvent.item;
    const messageFrom =
      eventItem.message.from && typeof eventItem.message.from !== "string"
        ? {
            from_user_id: eventItem.message.from.id,
            from_user_mention_name: eventItem.message.from.mention_name,
            from_user_name: eventItem.message.from.name
          }
        : {};

    const supportMessage = Object.assign(
      {},
      {
        date: eventItem.message.date,
        id: eventItem.message.id,
        message: eventItem.message.message,
        raw_json: JSON.stringify(eventItem.message),
        support_room_api_id: eventItem.room.id,
        type: eventItem.message.type
      },
      messageFrom
    );

    const bigquery = new BigQuery();
    const dataset = bigquery.dataset("app_frameworks_metrics");
    const table = dataset.table("hipchat_support_messages");

    await table.insert(supportMessage);

    // tslint:disable-next-line:no-console
    console.log(
      `Message ${eventItem.message.id} successfully written to BigQuery.`
    );

    return {
      statusCode: 201
    };
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(`There was an error writing to BigQuery: ${err}`);

    return {
      statusCode: 400
    };
  }
};
