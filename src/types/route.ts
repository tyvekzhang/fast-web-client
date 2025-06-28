export interface RouteMeta {
  title?: string;
  affix?: boolean;
  icon?: string;
}

export interface RouteObject {
  path: string;
  fullPath?: string;
  meta?: RouteMeta;
  children?: RouteObject[];
}
