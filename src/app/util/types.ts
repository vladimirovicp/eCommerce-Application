export interface ElementParams {
  tag?: string;
  id?: string;
  classNames?: Array<string>;
  textContent?: string;
  callback?: (event?: Event) => void;
  eventType?: string;
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
  id?: string;
}

export interface InputParams {
  classNames?: Array<string>;
  id?: string;
  callback?: (event?: Event) => void;
  callbackFocus?: (event?: Event) => void;
  callbackBlur?: (event?: Event) => void;
  eventType?: string;
  attributes?: { [key: string]: string };
  type: string;
}

export interface LinkImageData {
  imageClassNames?: string;
  containerClassNames?: string;
  src: string;
  alt: string;
}

export interface ListCountry {
  code: string;
  name: string;
}
