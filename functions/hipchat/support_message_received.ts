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

    const message = roomMessageEvent.item.message;
    const messageFrom =
      message.from && typeof message.from !== "string"
        ? {
            from_user_id: message.from.id,
            from_user_mention_name: message.from.mention_name,
            from_user_name: message.from.name
          }
        : {};

    const supportMessage = Object.assign(
      {},
      {
        date: message.date,
        id: message.id,
        message: message.message,
        raw_json: JSON.stringify(message),
        support_room_api_id: roomMessageEvent.room.id,
        type: message.type
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
