import '../../../assets/scss/page/catalog.scss';
import './index.scss';
import { ProductProjection } from '@commercetools/platform-sdk';
import { getTheCart, updateProducts } from '../../api/products';
import View from '../../common/view';
import SecondaryMenu from '../../components/secondary-menu';
import ElementCreator from '../../util/element-creator';
import CatalogCard from './card';
import InputCreator from '../../util/input-creator';
import ListCreator from '../../util/list-creator';
import Router from '../../router/router';
import { Categories, FilterParameter, FilterParameters, SortParameters } from './constants';

const PRODUCT_AMOUNT_TO_SHOW = 15;

const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: '0px',
  threshold: 0.7,
};

export default class CatalogPage extends View {
  private router: Router;

  private secondaryMenu: SecondaryMenu;

  private cardsPerPage: number = 110;

  private offset: number = 0;

  private catalogCards: ElementCreator;

  private currentSort: string;

  private currentCategory: string;

  private searchValue: string;

  private currentFilter: { [key: string]: string[] };

  private observer: IntersectionObserver;

  private footer: Element | null = document.querySelector('.footer');

  private currentOffset: number = 1;

  private cardsToShow: CatalogCard[] = [];

  private handleObserver: IntersectionObserverCallback;

  constructor(secondaryMenu: SecondaryMenu, router: Router) {
    const params = {
      tag: 'div',
      classNames: ['container'],
    };
    super(params);
    this.secondaryMenu = secondaryMenu;
    this.currentCategory = this.secondaryMenu.category
      ? Categories[this.secondaryMenu.category as keyof typeof Categories]
      : Categories['Show all'];
    if (this.secondaryMenu.category) {
      this.secondaryMenu.updateContent(['catalog', this.secondaryMenu.category], false);
      this.secondaryMenu.category = undefined;
    }
    this.catalogCards = new ElementCreator<HTMLDivElement>({
      classNames: ['catalog-cards'],
    });
    this.currentSort = 'name.en-GB asc';
    this.currentFilter = {};
    this.searchValue = '';
    FilterParameters.forEach((parameter) => {
      this.currentFilter[parameter.name] = [];
    });
    this.createSecondaryMenu();
    this.loading();
    this.setContent();
    this.router = router;
    this.handleObserver = (entries: IntersectionObserverEntry[]): void => {
      if (entries[0].isIntersecting) {
        this.displayProductCards(
          this.cardsToShow,
          this.currentOffset * PRODUCT_AMOUNT_TO_SHOW,
          (this.currentOffset + 1) * PRODUCT_AMOUNT_TO_SHOW
        );
        this.currentOffset += 1;
      }
    };
    this.observer = new IntersectionObserver(this.handleObserver, OBSERVER_OPTIONS);
  }

  private async setContent(): Promise<void> {
    const categoryContainer = this.createCategoriesMenu();
    this.viewElementCreator.addInnerElements([categoryContainer, this.catalogCards]);
    const response = await updateProducts(this.cardsPerPage, this.offset, this.currentCategory, this.currentSort);
    if (!response) {
      return undefined;
    }

    await this.getProductCards(response);
    if (this.cardsToShow.length === 0) {
      return undefined;
    }

    this.displayProductCards(this.cardsToShow, 0, PRODUCT_AMOUNT_TO_SHOW);

    if (this.footer) {
      this.observer.observe(this.footer);
    }
    this.loadingEnd();
    return undefined;
  }

  private async getProductCards(products: ProductProjection[]): Promise<void> {
    this.catalogCards.getElement().innerHTML = '';

    const cart = await getTheCart();
    const productsInCart: string[] = [];
    if (cart) {
      cart.lineItems.forEach((item) => productsInCart.push(item.productId));
    }

    if (products.length === 0) {
      this.catalogCards.getElement().innerHTML = 'No products found matching your request';
    } else {
      products.forEach((product) => {
        const {
          id,
          name,
          key,
          masterVariant: { images, prices, attributes },
        } = product;

        const card = new CatalogCard(
          {
            id,
            name: attributes?.[1]?.value || '',
            imageUrl: images?.[0]?.url || '',
            description: name['en-GB'],
            price: prices?.[0]?.value.centAmount || 0,
            discountPrice: prices?.[0]?.discounted?.value.centAmount || 0,
            key,
          },
          this.router,
          productsInCart.includes(id)
        );
        this.cardsToShow.push(card);
      });
    }
  }

  private displayProductCards(cards: CatalogCard[], startPosition: number, lastPosition: number): void {
    for (let i = startPosition; i < lastPosition; i += 1) {
      if (cards[i] !== undefined) {
        this.catalogCards.getElement().append(cards[i].getElement());
      }
    }
  }

  private createCategoriesMenu(): ElementCreator {
    const categoryContainer = new ElementCreator({ classNames: ['category-container'] });
    const categoryArray: HTMLElement[] = [];

    Object.entries(Categories).forEach(([category, value]) => {
      const categoryElement = new ElementCreator({
        classNames: value === this.currentCategory ? ['category', 'active'] : ['category'],
        textContent: category,
        callback: (event): void => {
          const target = event?.target;
          if (target instanceof HTMLElement && !target.classList.contains('active')) {
            categoryArray.forEach((item) => item.classList.remove('active'));
            target.classList.add('active');

            this.secondaryMenu.updateContent(['catalog', category], false);
            this.currentCategory = value;
            this.applyChanges();
          }
        },
      });
      categoryArray.push(categoryElement.getElement());
    });
    categoryContainer.addInnerElements(categoryArray);
    return categoryContainer;
  }

  private createSecondaryMenu(): void {
    const menuContainer = new ElementCreator({ classNames: ['secondary-menu__nav'] });
    menuContainer.addInnerElements([this.createRemoveFiltersButton(), this.createFilterMenu(), this.createSortMenu()]);

    this.secondaryMenu.addElement([this.createSearchMenu(), menuContainer]);
  }

  private createRemoveFiltersButton(): ElementCreator<HTMLSpanElement> {
    const button = new ElementCreator<HTMLSpanElement>({
      tag: 'span',
      classNames: ['secondary-menu__filter-btn'],
      textContent: 'remove filters',
      callback: (): void => {
        FilterParameters.forEach((parameter) => {
          this.currentFilter[parameter.name] = [];
        });
        const filterBox = document.querySelector('.secondary-menu__filter-box');
        if (filterBox) {
          const filtersItems = filterBox.querySelectorAll('.active');
          filtersItems.forEach((item) => item.classList.remove('active'));
        }
        this.applyChanges();
      },
    });
    return button;
  }

  private createSearchMenu(): ElementCreator {
    const container = new ElementCreator<HTMLDivElement>({ classNames: ['secondary-menu__search'] });

    const input = new InputCreator({ type: 'search', attributes: { placeholder: 'search' } });
    input.getElement().addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        this.applySearch(input.getElement());
      }
    });

    const button = new ElementCreator<HTMLButtonElement>({
      tag: 'button',
      textContent: 'Search',
      callback: async (): Promise<void> => {
        this.applySearch(input.getElement());
      },
    });
    container.addInnerElements([input, button]);

    return container;
  }

  private createSortMenu(): ElementCreator {
    const sortContainer = new ElementCreator<HTMLDivElement>({ classNames: ['secondary-menu__sort'] });
    const switchInput = new InputCreator({
      type: 'checkbox',
      id: 'sort-toggle',
      classNames: ['sort-toggle__input'],
      callback: (): void => {
        this.filterChecked();
      },
    });
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
    const sortMenuItems = Object.entries(SortParameters).map(([key, value], index) => {
      const sortMenuItem = new ElementCreator<HTMLDivElement>({
        classNames: index === 0 ? ['checkbox-with-text', 'active'] : ['checkbox-with-text'],
        callback: async (): Promise<void> => {
          this.currentSort = key;
          // переключение классов для того, чтобы чекбокс стал активным
          sortMenuItems.forEach((item) => {
            if (item.classList.contains('active')) {
              item.classList.remove('active');
            }
          });
          sortMenuItem.getElement().classList.add('active');

          switchInput.getElement().dispatchEvent(new MouseEvent('click'));
          this.applyChanges();
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
      callback: (): void => {
        this.sortChecked();
      },
    });
    const stringElement = new ElementCreator({
      tag: 'span',
      classNames: ['secondary-menu__filter-btn'],
      textContent: 'Filter',
    });
    const label = switchInput.createLabel('', 'secondary-menu__filter-button', [stringElement]);

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
    filterMenuBox.addInnerElements([this.createFilterButton()]);
    filterContainer.addInnerElements([switchInput, label, filterMenuBox]);
    return filterContainer;
  }

  private createFilterButton(): ElementCreator<HTMLButtonElement> {
    const button = new ElementCreator<HTMLButtonElement>({
      tag: 'button',
      id: 'catalog-filter-button',
      classNames: ['btn-default'],
      textContent: 'filter',
      callback: (): void => {
        document.body.classList.remove('_lock');
        this.filterChecked();
        this.applyChanges();
      },
    });
    return button;
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
            this.currentFilter[options.name] = this.currentFilter[options.name].filter((item) => item !== text);
          } else {
            this.currentFilter[options.name].push(text);
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

  private async applyChanges(): Promise<void> {
    this.cardsToShow.length = 0;
    this.currentOffset = 1;
    const response = await updateProducts(
      this.cardsPerPage,
      this.offset,
      this.currentCategory,
      this.currentSort,
      this.currentFilter,
      this.searchValue ? this.searchValue : undefined
    );
    if (!response) {
      return undefined;
    }

    await this.getProductCards(response);
    if (this.cardsToShow.length === 0) {
      return undefined;
    }

    this.displayProductCards(this.cardsToShow, 0, PRODUCT_AMOUNT_TO_SHOW);

    if (this.footer) {
      this.observer.observe(this.footer);
    }
    return undefined;
  }

  private async applySearch(input: HTMLInputElement): Promise<void> {
    this.searchValue = input.value;
    // введенное значение остается в инпуте, показывая по чему мы сейчас фильтруем
    // введенное в поиске значение СОХРАНЯЕТСЯ при переходе по категориям

    // сбрасываем все фильтры
    FilterParameters.forEach((parameter) => {
      this.currentFilter[parameter.name] = [];
    });
    document.querySelectorAll('.checkbox-with-text').forEach((filter) => {
      filter.classList.remove('active');
    });
    this.applyChanges();
  }

  private lockCheckedSortFilter = (e: Event): void => {
    const element = e.target as HTMLElement;
    const filterToggle = document.getElementById('filter-toggle') as HTMLInputElement;
    const sortToggle = document.getElementById('sort-toggle') as HTMLInputElement;
    if (element.className === '_lock') {
      if (filterToggle.checked && !sortToggle.checked) {
        this.applyChanges();
      }
      filterToggle.checked = true;
      if (filterToggle.checked) {
        filterToggle.checked = false;
      }
      if (sortToggle.checked) {
        sortToggle.checked = false;
      }
      document.body.classList.remove('_lock');
      document.removeEventListener('click', this.lockCheckedSortFilter);
    } else {
      const parentElement = element.parentNode as HTMLElement;
      const parentElementTwo = parentElement.parentNode as HTMLElement;
      if (parentElementTwo.classList[0] === 'sort-item') {
        document.body.classList.remove('_lock');
        document.removeEventListener('click', this.lockCheckedSortFilter);
      } else if (element.className === 'sort-toggle__input' || element.className === 'filter-toggle__input') {
        if (!filterToggle.checked && !sortToggle.checked) {
          document.body.classList.remove('_lock');
          document.removeEventListener('click', this.lockCheckedSortFilter);
        }
      }
    }
  };

  private sortChecked = (): void => {
    const sortToggle = document.getElementById('sort-toggle') as HTMLInputElement;
    if (sortToggle) {
      if (sortToggle.checked) {
        sortToggle.checked = false;
      } else {
        document.body.classList.add('_lock');
        document.addEventListener('click', this.lockCheckedSortFilter);
      }
    }
  };

  private filterChecked(): void {
    const filterToggle = document.getElementById('filter-toggle') as HTMLInputElement;
    if (filterToggle) {
      if (filterToggle.checked) {
        filterToggle.checked = false;
      } else {
        document.body.classList.add('_lock');
        document.addEventListener('click', this.lockCheckedSortFilter);
      }
    }
  }
}
