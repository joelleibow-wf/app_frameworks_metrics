export interface CreateWebHookResource {
  name?: string;
  url: string;
  pattern?: string;
  authentication?: "jwt" | "none";
  key?: string;
  event:
    | "room_archived"
    | "room_created"
    | "room_deleted"
    | "room_enter"
    | "room_exit"
    | "room_file_upload"
    | "room_message"
    | "room_notification"
    | "room_topic_change"
    | "room_unarchived";
}
