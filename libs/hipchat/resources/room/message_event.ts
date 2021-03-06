import { MessageResource } from "../message";
import { RoomResource } from "./room";

export interface MessageEventResource {
  event: string;
  item: {
    message: MessageResource;
    room: RoomResource;
  };
  oauth_client_id: string;
  webhook_id: number;
}
