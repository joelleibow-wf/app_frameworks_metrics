import { ResourceLinks } from "../resource";

interface RoomResourceLinks extends ResourceLinks {
  members: string;
  participants: string;
  webhooks: string;
}

export interface RoomResource {
  id: number;
  is_archived: boolean;
  links: RoomResourceLinks;
  name: string;
  privacy: "public" | "private";
  version: string;
}
