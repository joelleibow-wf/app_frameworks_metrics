import { APIGatewayEvent, Handler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { verify } from "jsonwebtoken";

import { MessageResource } from "../../libs/hipchat/resources/message";
import { RoomMessageEventResource } from "../../libs/hipchat/resources/room";
import { InstallableService } from "../../libs/hipchat/services/installable";

export const supportMessageReceived: Handler = async (
  event: APIGatewayEvent
) => {
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

    // tslint:disable-next-line:no-console
    console.log(
      `The following message will be saved to BigQuery: ${JSON.stringify(
        supportMessage
      )}\n\n... eventually 😔`
    );
  } catch (err) {
    throw err;
  }

  return {
    statusCode: 200
  };
};
