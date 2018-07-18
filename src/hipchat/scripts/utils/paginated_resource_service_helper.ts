import { Response } from "node-fetch";

import { PaginatedResource } from "../../resources";
import { Base, SearchParams } from "../../services/base";

export default class PaginatedResourceServiceHelper<
  S extends Base,
  R extends PaginatedResource
> {
  public fetchedPages = 0;

  private service: S;
  private searchParams: SearchParams;
  private resourceJson: R;

  get resourceItems(): R["items"] {
    return this.resourceJson.items;
  }

  constructor(service: S, searchParams?: SearchParams) {
    this.service = service;

    if (searchParams) {
      this.searchParams = searchParams;
    }
  }

  public async fetchAll() {
    // tslint:disable-next-line:no-console
    console.log(`Fetching all pages for provided resource...`);

    const serviceResponse: Response = await this.service.fetch(
      null,
      this.searchParams
    );

    this.fetchedPages++;

    if (serviceResponse.ok) {
      this.resourceJson = await serviceResponse.json();

      if (this.resourceJson.links && this.resourceJson.links.next) {
        await this.fetchResourceNextPage(this.resourceJson.links.next);
      }
    } else {
      throw Error(
        `Received response '${
          serviceResponse.statusText
        }' from resource API w/ URL: ${serviceResponse.url}`
      );
    }
  }

  private async fetchResourceNextPage(nextPageUrl: string) {
    const serviceResponse = await this.service.fetch(nextPageUrl);

    this.fetchedPages++;

    if (serviceResponse.ok) {
      const resourceJson: R = await serviceResponse.json();

      this.resourceJson.items = this.resourceJson.items.concat(
        resourceJson.items
      );

      if (resourceJson.links && resourceJson.links.next) {
        await this.fetchResourceNextPage(resourceJson.links.next);
      }
    } else {
      throw Error(
        `Received response '${
          serviceResponse.statusText
        }' from resource API w/ URL: ${serviceResponse.url}`
      );
    }
  }
}
