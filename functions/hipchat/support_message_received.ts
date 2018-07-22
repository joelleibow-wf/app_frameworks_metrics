import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";

export const supportMessageReceived: Handler = (
  event: APIGatewayEvent,
  context: Context,
  cb: Callback
) => {
  // tslint:disable-next-line:no-console
  console.log(event);

  const response = {
    statusCode: 200
  };

  cb(null, response);
};
