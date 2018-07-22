import fetch, { Response } from "node-fetch";
import { URL, URLSearchParams } from "url";

import { HipchatService, SearchParams } from "../service";

export class History extends HipchatService {
  private pathName: string;

  constructor(roomId: number) {
    super(roomId);

    this.pathName = `/v2/room/${roomId}/history`;
  }

  public async fetch(historyUrl?: string, searchParams?: SearchParams) {
    return await fetch(this.createResourceUrl(historyUrl, searchParams).href);
  }

  // TODO: Can this be abstracted/refactored?
  private createResourceUrl(historyUrl?: string, searchParams?: SearchParams) {
    searchParams = Object.assign(
      {},
      {
        auth_token: process.env.HIPCHAT_API_KEY
      },
      searchParams
    );
    const urlSearchParams = new URLSearchParams(searchParams).toString();

    const resourceUrl = new URL(
      historyUrl || `${this.origin}/${this.pathName}`
    );
    resourceUrl.search = resourceUrl.search
      ? `${resourceUrl.search}&${urlSearchParams}`
      : urlSearchParams;

    return resourceUrl;
  }
}
