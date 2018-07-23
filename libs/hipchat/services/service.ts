import { AxiosResponse } from "axios";

import { URL, URLSearchParams } from "url";

import { resourceServices } from "../../../config/resource_services";

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export abstract class HipchatService<R> {
  protected pathName: string;

  private origin: string;

  constructor(public resourceId: string | number) {
    this.origin = resourceServices.hipchat.origin;
  }

  public async fetch?(
    url?: string,
    searchParams?: SearchParams
  ): Promise<AxiosResponse<R>>;

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
      ? `${url.search}&${urlSearchParams}`
      : urlSearchParams;

    return url.href;
  }
}
