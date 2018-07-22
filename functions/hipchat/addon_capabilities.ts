import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";

export const addonCapabilities: Handler = (
  event: APIGatewayEvent,
  context: Context,
  done: Callback
) => {
  const descriptor = {
    capabilities: {
      hipchatApiConsumer: {
        fromName: "App Frameworks Support Monitor",
        scopes: ["send_notification"]
      },
      installable: {
        allowGlobal: false,
        allowRoom: true,
        callbackUrl:
          "https://e00ao72kje.execute-api.us-east-1.amazonaws.com/addon/installed"
      }
    },
    description:
      "Listener and handler for messges within a Supoort Hipchat room",
    key: "app-frameworks-support-monitor",
    links: {
      homepage:
        "https://github.com/joelleibow-wf/app_frameworks_metrics/tree/master/functions/hipchat",
      self:
        "https://e00ao72kje.execute-api.us-east-1.amazonaws.com/addon/capabilities"
    },
    name: "App Frameworks Support Monitor",
    vendor: {
      name: "Workiva: App Frameworks",
      url: "https://github.com/orgs/Workiva/teams/app-frameworks"
    },
    webhook: [
      {
        authentication: "jwt",
        event: "room_message",
        name: "Echo",
        url: "https://my.server.com/my-addon/echo-webhook"
      }
    ]
  };

  const response = {
    body: JSON.stringify(descriptor),
    statusCode: 200
  };

  done(null, response);
};
