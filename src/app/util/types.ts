export interface ElementParams {
  tag: string;
  classNames?: Array<string>;
  textContent?: string;
  callback?: (event?: Event) => void;
}
