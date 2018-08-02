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
        scopes: [
          "send_message",
          "send_notification",
          "view_messages",
          "view_room"
        ]
      },
      installable: {
        allowGlobal: false,
        allowRoom: true,
        callbackUrl: `${process.env.DEPLOY_URL}/addon/installed`,
        uninstalledUrl: `${process.env.DEPLOY_URL}/addon/uninstalled`
      },
      webhook: [
        {
          authentication: "jwt",
          event: "room_message",
          name: "Support room message handler",
          url: `${process.env.DEPLOY_URL}/support-messages`
        }
      ]
    },
    description: "A supoort room message handler",
    key: "app-frameworks-support-monitor",
    links: {
      homepage:
        "https://github.com/joelleibow-wf/app_frameworks_metrics/tree/master/functions/hipchat",
      self: `${process.env.DEPLOY_URL}/addon/capabilities`
    },
    name: "App Frameworks Support Monitor",
    vendor: {
      name: "Workiva: App Frameworks",
      url: "https://github.com/orgs/Workiva/teams/app-frameworks"
    }
  };

  const response = {
    body: JSON.stringify(descriptor),
    headers: {
      "content-type": "application/json"
    },
    statusCode: 200
  };

  done(null, response);
};
