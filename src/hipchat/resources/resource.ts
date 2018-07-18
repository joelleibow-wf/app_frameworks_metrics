export interface ResourceLinks {
  next?: string;
  prev?: string;
  self: string;
}

export interface PaginatedResource {
  items: any[];
  links: ResourceLinks;
}
