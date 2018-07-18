import { MessageResource } from "../message/message";
import { PaginatedResource } from "../resource";

export interface HistoryResource extends PaginatedResource {
  items: MessageResource[];
}
