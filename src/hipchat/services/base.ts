import { Response } from "node-fetch";

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export abstract class Base {
  public fetch: (
    url?: string,
    searchParams?: SearchParams
  ) => Promise<Response>;
}
