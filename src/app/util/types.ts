export interface ElementParams {
  tag: string;
  classNames?: Array<string>;
  textContent?: string;
  /* Не уверена на счет коллбека. Может быть такая ситуация, что функция-коллбек
  будет что-то возвращать, не void?
  Плюс везде коллбек будет делать разное, плюс не везде он будет реагировать на клик.
  Похоже, что он везде будет достаточно уникальным. 
  Нужен ли он вообще в базовом элементе?
  */
  callback?: (event?: Event) => void;
  // Не уверена, что нужно в базовом создателе элементов добавлять аттрибуты.
  // Вещь, всё-таки, довольно уникальная, невезде нужная, плюс, задолбемся
  // типы правильно прописывать.
}

interface ParamsInputElement {
  type: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
}

export { ParamsInputElement };
