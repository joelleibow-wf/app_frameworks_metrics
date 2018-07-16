export interface ResourceLinks {
  next?: string;
  prev?: string;
  self: string;
}

export interface PaginatedResource {
  links: ResourceLinks;
}
