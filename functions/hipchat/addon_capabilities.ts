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
          "send_message", // Send private one-on-one messages
          "send_notification", // Send room notifications
          "view_messages", // View messages from chat rooms and private chats you have access to
          "view_room" // View room information and participants, but not history
        ]
      },
      installable: {
        allowGlobal: false,
        allowRoom: true,
        callbackUrl:
          "https://umoqgqh6k4.execute-api.us-east-1.amazonaws.com/dev/addon/installed",
        uninstalledUrl:
          "https://umoqgqh6k4.execute-api.us-east-1.amazonaws.com/dev/addon/uninstalled"
      }
    },
    description: "A supoort room message handler",
    key: "app-frameworks-support-monitor",
    links: {
      homepage:
        "https://github.com/joelleibow-wf/app_frameworks_metrics/tree/master/functions/hipchat",
      self:
        "https://umoqgqh6k4.execute-api.us-east-1.amazonaws.com/dev/addon/capabilities"
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
        name: "Support room message handler",
        url:
          "https://umoqgqh6k4.execute-api.us-east-1.amazonaws.com/dev/support-messages"
      }
    ]
  };

  const response = {
    body: JSON.stringify(descriptor),
    statusCode: 200
  };

  done(null, response);
};
