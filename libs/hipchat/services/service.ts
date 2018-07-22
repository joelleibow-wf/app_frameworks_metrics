import { Response } from "node-fetch";
import { URL, URLSearchParams } from "url";

import { resourceServices } from "../../../config/resource_services";

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export abstract class HipchatService {
  protected pathName: string;

  private origin: string;

  constructor(public resourceId: number) {
    this.origin = resourceServices.hipchat.origin;
  }

  public async fetch?(
    url?: string,
    searchParams?: SearchParams
  ): Promise<Response>;

  protected createResourceUrl(
    resourceUrl?: string,
    searchParams?: SearchParams
  ) {
    searchParams = Object.assign(
      {},
      {
        auth_token: process.env.HIPCHAT_API_KEY
      },
      searchParams
    );
    const urlSearchParams = new URLSearchParams(searchParams).toString();

    const url = new URL(resourceUrl || `${this.origin}/${this.pathName}`);
    url.search = url.search
      ? `${resourceUrl.search}&${urlSearchParams}`
      : urlSearchParams;

    return url.href;
  }
}
