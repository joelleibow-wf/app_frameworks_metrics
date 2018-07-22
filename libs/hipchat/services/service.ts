import { Response } from "node-fetch";

import { resourceServices } from "../../../config/resource_services";

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export abstract class HipchatService {
  protected origin: string;

  constructor(public resourceId: number) {
    this.origin = resourceServices.hipchat.origin;
  }

  public abstract async fetch(
    url?: string,
    searchParams?: SearchParams
  ): Promise<Response>;
}
