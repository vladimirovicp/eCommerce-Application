import '../../../assets/scss/page/catalog.scss';
import { Product } from '@commercetools/platform-sdk';
import getProducts from '../../api/products';
import View from '../../common/view';
import SecondaryMenu from '../../components/secondary-menu';
import ElementCreator from '../../util/element-creator';
import CatalogCard from './card';
import InputCreator from '../../util/input-creator';
import ListCreator from '../../util/list-creator';

enum SortParameters {
  AlphabeticallyAZ = 'Alphabetically, A-Z',
  AlphabeticallyZA = 'Alphabetically, Z-A',
  PriceLowToHigh = 'Price, low to high',
  PriceHighToLow = 'Price, high to low',
}

interface FilterParameter {
  name: string;
  title: string;
  filterItems: string[];
}

const FilterParameters: FilterParameter[] = [
  { name: 'category', title: 'Category', filterItems: ['Bikes', 'Electric Bikes'] },
  { name: 'size', title: 'Wheel size', filterItems: ['24', '27.5', '29', '700c'] },
  {
    name: 'brake-type',
    title: 'Brake type',
    filterItems: ['hydraulic disc brakes', 'mechanical disc brakes', 'v-brakes'],
  },
];

export default class CatalogPage extends View {
  private secondaryMenu: SecondaryMenu;

  private catalogCards: ElementCreator;

  private currentSort: SortParameters;

  private currentFilter: string[];

  constructor(secondaryMenu: SecondaryMenu) {
    const params = {
      tag: 'div',
      classNames: ['container'],
    };
    super(params);
    this.secondaryMenu = secondaryMenu;
    this.catalogCards = new ElementCreator<HTMLDivElement>({
      classNames: ['catalog-cards'],
    });
    this.currentSort = SortParameters.AlphabeticallyAZ;
    this.currentFilter = [];
    this.createSecondaryMenu();
    this.setContent();
  }

  private async setContent(): Promise<void> {
    const response = await getProducts(10, 0);
    if (response) {
      this.showProductCards(response);
    }
    this.viewElementCreator.addInnerElements([this.catalogCards]);
  }

  private showProductCards(products: Product[]): void {
    this.catalogCards.getElement().innerHTML = '';
    products.forEach((product) => {
      const {
        masterData: {
          current: {
            name,
            masterVariant: { images, prices, attributes },
          },
        },
        id,
      } = product;

      const card = new CatalogCard({
        id,
        name: attributes?.[1]?.value || '',
        imageUrl: images?.[0]?.url || '',
        description: name['en-GB'],
        price: prices?.[0]?.value.centAmount || 0,
        discountPrice: prices?.[0]?.discounted?.value.centAmount || 0,
      });

      this.catalogCards.addInnerElements([card]);
    });
  }

  private createSecondaryMenu(): void {
    const menuContainer = new ElementCreator({ classNames: ['secondary-menu__nav'] });
    menuContainer.addInnerElements([this.createSortMenu(), this.createFilterMenu()]);

    this.secondaryMenu.addElement([this.createSearchMenu(), menuContainer]);
  }

  private createSearchMenu(): ElementCreator {
    const container = new ElementCreator<HTMLDivElement>({ classNames: ['secondary-menu__search'] });

    const input = new InputCreator({ type: 'search', attributes: { placeholder: 'search' } });
    const button = new ElementCreator<HTMLButtonElement>({
      tag: 'button',
      textContent: 'Search',
      callback: (): void => {
        // поиск
      },
    });
    container.addInnerElements([input, button]);

    return container;
  }

  private createSortMenu(): ElementCreator {
    const sortContainer = new ElementCreator<HTMLDivElement>({ classNames: ['secondary-menu__sort'] });
    const switchInput = new InputCreator({ type: 'checkbox', id: 'sort-toggle', classNames: ['sort-toggle__input'] });
    const sortByElement = new ElementCreator<HTMLDivElement>({
      classNames: ['secondary-menu__sort-text'],
      textContent: 'Sort by:',
    });
    const sortStringElement = new ElementCreator<HTMLSpanElement>({
      tag: 'span',
      classNames: ['secondary-menu__sort-btn'],
    });
    const label = switchInput.createLabel('', 'secondary-menu__sort-button', [sortByElement, sortStringElement]);

    const sortMenuBox = new ElementCreator<HTMLDivElement>({ classNames: ['secondary-menu__sort-box'] });
    const sortList = this.createSortParameters(switchInput);

    sortMenuBox.addInnerElements([sortList]);
    sortContainer.addInnerElements([switchInput, label, sortMenuBox]);

    return sortContainer;
  }

  private createSortParameters(switchInput: InputCreator): HTMLElement {
    const sortMenuItems = Object.keys(SortParameters).map((key, index) => {
      const value = SortParameters[key as keyof typeof SortParameters];
      const sortMenuItem = new ElementCreator<HTMLDivElement>({
        classNames: index === 0 ? ['checkbox-with-text', 'active'] : ['checkbox-with-text'],
        callback: (): void => {
          this.currentSort = value;
          sortMenuItems.forEach((item) => {
            if (item.classList.contains('active')) {
              item.classList.remove('active');
            }
          });
          sortMenuItem.getElement().classList.add('active');
          switchInput.getElement().dispatchEvent(new MouseEvent('click'));
          // обновить данные
          // закрывать меню по клику снаружи
        },
      });
      sortMenuItem.getElement().innerHTML = `<span class="filter__decor"></span><span class="filter__text">${value}</span>`;
      return sortMenuItem.getElement();
    });

    const sortList = new ListCreator({
      listItems: sortMenuItems,
      listClass: ['sort__list'],
      itemClass: ['sort-item'],
    });
    return sortList.getHtmlElement();
  }

  private createFilterMenu(): ElementCreator<HTMLDivElement> {
    const filterContainer = new ElementCreator<HTMLDivElement>({ classNames: ['secondary-menu__filter'] });

    const switchInput = new InputCreator({
      type: 'checkbox',
      id: 'filter-toggle',
      classNames: ['filter-toggle__input'],
    });
    const stringElement = new ElementCreator({
      tag: 'span',
      classNames: ['secondary-menu__filter-btn'],
      textContent: 'Filter',
    });
    const label = switchInput.createLabel('', 'secondary-menu__filter-button', [stringElement]);
    const button = new ElementCreator<HTMLButtonElement>({
      tag: 'button',
      classNames: ['btn-default'],
      textContent: 'filter',
      callback: (): void => {
        // применить фильтры, обновить карточки, то же при закрытии меню фильтра
      },
    });

    const filterMenuBox = new ElementCreator<HTMLDivElement>({ classNames: ['secondary-menu__filter-box'] });
    const filterTitle = new ElementCreator<HTMLDivElement>({
      classNames: ['secondary-menu__filter-title'],
      textContent: 'FILTER',
    });
    filterMenuBox.addInnerElements([filterTitle]);
    // генерирование каждой категории фильтрации и добавление их в контейнер
    FilterParameters.forEach((option) => {
      const category = this.createFilterParameter(option);
      filterMenuBox.addInnerElements([category]);
    });
    // ////////////////////////
    filterMenuBox.addInnerElements([button]);
    filterContainer.addInnerElements([switchInput, label, filterMenuBox]);
    return filterContainer;
  }

  private createFilterParameter(options: FilterParameter): ElementCreator<HTMLDivElement> {
    const container = new ElementCreator<HTMLDivElement>({ classNames: ['filter-box', `filter-box__${options.name}`] });

    const titleElement = new ElementCreator<HTMLDivElement>({
      classNames: ['filter-box__title'],
      textContent: options.title,
    });
    const filterListBox = new ElementCreator<HTMLDivElement>({ classNames: ['filter-categoty__data'] });

    const filterMenuItems = options.filterItems.map((text) => {
      const filterMenuItem = new ElementCreator<HTMLDivElement>({
        classNames: ['checkbox-with-text'],
        callback: (): void => {
          if (filterMenuItem.getElement().classList.contains('active')) {
            this.currentFilter = this.currentFilter.filter((item) => item !== text);
          } else {
            this.currentFilter.push(text);
          }
          filterMenuItem.getElement().classList.toggle('active');
        },
      });
      filterMenuItem.getElement().innerHTML = `<span class="filter__decor"></span><span class="filter__text">${text}</span>`;
      return filterMenuItem.getElement();
    });
    const filterList = new ListCreator({
      listItems: filterMenuItems,
      listClass: ['filter__list'],
      itemClass: ['filter-item'],
    });

    filterListBox.addInnerElements([filterList.getHtmlElement()]);
    container.addInnerElements([titleElement, filterListBox]);
    return container;
  }
}
