import { Handler } from "aws-lambda";
import { randomBytes } from "crypto";
import { config } from "dotenv";

import { RoomWebHookService } from "../../libs/hipchat/services/room";

config();

export const createRoomWebhook: Handler = async (event, context, callback) => {
  const roomWebhookService = new RoomWebHookService(
    event.pathParameters.roomId,
    randomBytes(32).toString()
  );

  const roomWebhookServiceCreateResponse = await roomWebhookService.create({
    event: "room_message",
    name: "justATest",
    url: "http://localhost:3000/support-messages"
  });

  const roomWebhook = await roomWebhookServiceCreateResponse.json();

  const response = {
    body: JSON.stringify(roomWebhook),
    statusCode: roomWebhook.status
  };

  callback(null, response);
};
