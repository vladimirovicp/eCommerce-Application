export interface ElementParams {
  tag: string;
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

export interface LinkImageData {
  imageClassNames?: string;
  containerClassNames?: string;
  src: string;
  alt: string;
}
