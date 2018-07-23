import Axios from "axios";

import { RoomHistoryResource } from "../../resources/room";
import { HipchatService, SearchParams } from "../service";

export class History extends HipchatService<RoomHistoryResource> {
  constructor(roomId: string | number) {
    super(roomId);

    this.pathName = `/v2/room/${roomId}/history`;
  }

  public async fetch(historyUrl?: string, searchParams?: SearchParams) {
    return await Axios.get<RoomHistoryResource>(
      this.createResourceUrl(historyUrl, searchParams)
    );
  }
}
