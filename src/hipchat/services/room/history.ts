import fetch, { Response } from "node-fetch";
import { URL, URLSearchParams } from "url";

import { Base, SearchParams } from "../base";

export class History implements Base {
  private resourceUrl: string;
  private roomId: number;

  constructor(roomId: number) {
    this.resourceUrl = `https://workiva.hipchat.com/v2/room/${roomId}/history`;
    this.roomId = roomId;
  }

  public async fetch(
    historyUrl?: string,
    searchParams?: SearchParams
  ): Promise<Response> {
    return await fetch(this.createResourceUrl(historyUrl, searchParams).href);
  }

  private createResourceUrl(historyUrl?: string, searchParams?: SearchParams) {
    searchParams = Object.assign(
      {},
      {
        // TODO: Move this to an environment variable
        auth_token: "hnwS7ZLKXtimdRh5D47bVsdqGDPQQcTl5mPp28kg"
      },
      searchParams
    );
    const urlSearchParams = new URLSearchParams(searchParams).toString();

    const resourceUrl = new URL(historyUrl || this.resourceUrl);
    resourceUrl.search = resourceUrl.search
      ? `${resourceUrl.search}&${urlSearchParams}`
      : urlSearchParams;

    return resourceUrl;
  }
}