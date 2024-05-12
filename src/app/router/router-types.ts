export interface Route {
  path: string;
  callback: (id?: string) => void;
}

export interface PagePath {
  pageName: string;
  productId?: string;
  options?: Array<string>;
}
