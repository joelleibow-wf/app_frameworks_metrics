import { APIGatewayEvent, Handler } from "aws-lambda";

import { InstallableResource } from "../../libs/hipchat/resources/installable";
import { InstallableService } from "../../libs/hipchat/services/installable";

export const addonInstalled: Handler = async (event: APIGatewayEvent) => {
  const installableService = new InstallableService();
  const installItem: InstallableResource = JSON.parse(event.body);
  await installableService.save(installItem);

  return {
    body: JSON.stringify(installItem),
    headers: {
      "content-type": "application/json"
    },
    statusCode: 200
  };
};
