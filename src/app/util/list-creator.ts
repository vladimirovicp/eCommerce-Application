import ElementCreator from './element-creator';
import { ListParams } from './types';

export default class ListCreator {
  private listCreator: ElementCreator<HTMLUListElement>;

  constructor(listParams: ListParams) {
    this.listCreator = this.createList(listParams);
  }

  private createList(listParams: ListParams): ElementCreator<HTMLUListElement> {
    const linksListCreator = new ElementCreator<HTMLUListElement>({
      tag: 'ul',
      classNames: listParams.listClass ? listParams.listClass : [],
    });

    listParams.listItems.forEach((item) => {
      const listItemCreator = new ElementCreator<HTMLLIElement>({
        tag: 'li',
        classNames: listParams.itemClass ? listParams.itemClass : [],
      });
      listItemCreator.addInnerElements([item]);
      linksListCreator.addInnerElements([listItemCreator]);
    });

    return linksListCreator;
  }

  public getHtmlElement(): HTMLUListElement {
    return this.listCreator.getElement();
  }
}
