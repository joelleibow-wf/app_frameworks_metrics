import { PaginatedResource } from "../resource";

export interface UserResource extends PaginatedResource {
  id: string;
  mention_name: string;
  name: string;
  version: string;
}
