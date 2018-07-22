import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";

export const addonUninstalled: Handler = (
  event: APIGatewayEvent,
  context: Context,
  done: Callback
) => {
  // const eventQueryStringParameters = {
  //   installable_url: 'https://api.hipchat.com/v2/addon/2819299/installable/GamLUy6i2NWFbQL4O7I1',
  //   redirect_url: 'https://workiva.hipchat.com/addons/?room=4678558'
  // }

  // The above info is within the event. We might need to do some cleaning up of things when uninstalled.

  const response = {
    headers: {
      location: event.queryStringParameters.redirect_url
    },
    statusCode: 302
  };

  done(null, response);
};
