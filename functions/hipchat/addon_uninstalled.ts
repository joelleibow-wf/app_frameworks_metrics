import { APIGatewayEvent, Handler } from "aws-lambda";

import { InstallableService } from "../../libs/hipchat/services/installable";

export const addonUninstalled: Handler = async (event: APIGatewayEvent) => {
  const installableService = new InstallableService(
    event.queryStringParameters.installable_url
  );
  let logMessage = `App Frameworks Support Monitor was removed from Hipchat room `;

  try {
    const deleteResponse = await installableService.delete();
    logMessage += deleteResponse.Attributes.roomId.N;
  } catch (error) {
    logMessage += ` ${
      event.queryStringParameters.installable_url
    } but unsuccessfully deleted from record: ${error}`;
  }

  // tslint:disable-next-line:no-console
  console.log(logMessage);

  return {
    headers: {
      location: event.queryStringParameters.redirect_url
    },
    statusCode: 302
  };
};
