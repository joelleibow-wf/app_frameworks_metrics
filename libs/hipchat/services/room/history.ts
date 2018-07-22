import fetch, { Response } from "node-fetch";
import { URL, URLSearchParams } from "url";

import { HipchatService, SearchParams } from "../service";

export class History extends HipchatService {
  constructor(roomId: string | number) {
    super(roomId);

    this.pathName = `/v2/room/${roomId}/history`;
  }

  public async fetch(historyUrl?: string, searchParams?: SearchParams) {
    return await fetch(this.createResourceUrl(historyUrl, searchParams));
  }
}
