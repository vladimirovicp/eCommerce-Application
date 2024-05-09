export interface ElementParams {
  tag?: string;
  classNames?: Array<string>;
  textContent?: string;
  callback?: (event?: Event) => void;
  attributes?: { [key: string]: string };
}

export interface ListParams {
  listItems: HTMLElement[];
  listClass?: Array<string>;
  itemClass?: Array<string>;
}

export interface LinkParams {
  classNames?: Array<string>;
  textContent?: string;
  callback?: (event?: Event) => void;
  attributes?: { [key: string]: string };
  imageData?: LinkImageData;
}

export interface InputParams {
  classNames?: Array<string>;
  attributes?: { [key: string]: string };
  type: string;
}

export interface LinkImageData {
  imageClassNames?: string;
  containerClassNames?: string;
  src: string;
  alt: string;
}
