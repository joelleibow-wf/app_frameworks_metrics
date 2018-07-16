import { MessageLinkResource } from "../message";
import { UserResource } from "../user";

export interface MessageResource {
  color?: "yellow" | "green" | "red" | "purple" | "gray";
  date: string;
  file?: {
    name: string;
    size: number;
    thumb_url: string;
    url: string;
  };
  from?: string | UserResource;
  id: string;
  mentions: UserResource[];
  message: string;
  message_format?: "html" | "text";
  message_links?: MessageLinkResource[];
  type: "message" | "guest_access" | "topic" | "notification";
}
