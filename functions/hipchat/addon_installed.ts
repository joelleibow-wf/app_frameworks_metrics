import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";

export const addonInstalled: Handler = (
  event: APIGatewayEvent,
  context: Context,
  done: Callback
) => {
  // tslint:disable-next-line:no-console
  console.log(event.body);
  // tslint:disable-next-line:no-console
  console.log(event.headers);

  const response = {
    statusCode: 200
  };

  done(null, response);
};
