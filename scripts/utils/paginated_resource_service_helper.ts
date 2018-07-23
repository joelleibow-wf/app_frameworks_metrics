import { PaginatedResource } from "../../libs/hipchat/resources";
import {
  HipchatService,
  SearchParams
} from "../../libs/hipchat/services/service";

export default class PaginatedResourceServiceHelper<
  S extends HipchatService<R>,
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

    const serviceResponse = await this.service.fetch(null, this.searchParams);

    this.fetchedPages++;

    if (serviceResponse.status === 200) {
      this.resourceJson = await serviceResponse.data;

      if (this.resourceJson.links && this.resourceJson.links.next) {
        await this.fetchResourceNextPage(this.resourceJson.links.next);
      }
    } else {
      throw Error(
        `Received response '${
          serviceResponse.statusText
        }' from resource API w/ URL, ${
          serviceResponse.config.url
        } and headers, ${serviceResponse.headers.toString()}`
      );
    }
  }

  private async fetchResourceNextPage(nextPageUrl: string) {
    const serviceResponse = await this.service.fetch(nextPageUrl);

    this.fetchedPages++;

    if (serviceResponse.status === 200) {
      const resourceJson: R = await serviceResponse.data;

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
        }' from resource API w/ URL, ${
          serviceResponse.config.url
        } and headers, ${serviceResponse.headers.toString()}`
      );
    }
  }
}
