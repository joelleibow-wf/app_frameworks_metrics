import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";

export const getCapabilitiesDescriptor: Handler = (
  event: APIGatewayEvent,
  context: Context,
  done: Callback
) => {
  const descriptor = {
    capabilities: {
      hipchatApiConsumer: {
        fromName: "Sample Add-on",
        scopes: ["send_notification"]
      },
      installable: {
        allowGlobal: false,
        allowRoom: true,
        callbackUrl: "https://my.server.com/my-addon/installed"
      }
    },
    description: "Sample HipChat Addon",
    key: "sample-hipchat-addon",
    links: {
      homepage: "https://my.server.com/my-addon",
      self: "https://my.server.com/my-addon/capabilities.json"
    },
    name: "Sample Addon",
    vendor: {
      name: "Atlassian",
      url: "https://www.atlassian.com/"
    }
  };

  const response = {
    body: JSON.stringify(descriptor),
    statusCode: 200
  };

  done(null, response);
};
