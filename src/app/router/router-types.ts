export interface Route {
  path: string;
  callback: (id?: string) => void;
}

export interface SearchBarState {
  path: string;
  productId?: string;
  options?: Array<string>;
}
