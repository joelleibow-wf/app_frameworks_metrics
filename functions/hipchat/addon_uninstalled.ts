import { APIGatewayEvent, Handler } from "aws-lambda";

import { InstallableService } from "../../libs/hipchat/services/installable";

export const addonUninstalled: Handler = async (event: APIGatewayEvent) => {
  const installableService = new InstallableService(
    event.queryStringParameters.installable_url
  );
  await installableService.delete();

  const response = {
    headers: {
      location: event.queryStringParameters.redirect_url
    },
    statusCode: 302
  };
};
