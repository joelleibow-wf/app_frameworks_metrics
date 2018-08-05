import { APIGatewayEvent, Handler } from "aws-lambda";

import { InstallableResource } from "../../libs/hipchat/resources/installable";
import { InstallableService } from "../../libs/hipchat/services/installable";

export const addonInstalled: Handler = async (event: APIGatewayEvent) => {
  const installableService = new InstallableService();

  const installItem: InstallableResource = JSON.parse(event.body);

  const responseMap = {
    body: "",
    headers: {
      "content-type": "application/json"
    },
    statusCode: 201
  };

  let logMessage = "App Frameworks Support Monitor was ";

  try {
    await installableService.createFromResource(installItem);

    logMessage += `added to Hipchat room ${installItem.roomId}`;

    responseMap.body = JSON.stringify(installItem);
  } catch (error) {
    logMessage += `unsuccessful installing to Hipchat room ${
      installItem.roomId
    }: ${error}`;

    responseMap.body = JSON.stringify({
      message: error
    });

    responseMap.statusCode = 400;
  }

  // tslint:disable-next-line:no-console
  console.log(logMessage);

  return responseMap;
};
