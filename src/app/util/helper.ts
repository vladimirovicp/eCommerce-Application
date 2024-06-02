const adaptiveCloseMenu = (): void => {
  if (document.documentElement.clientWidth <= 768) {
    const headerMenu = document.querySelector('.header__menu') as HTMLElement;
    const headerNavToggle = headerMenu?.querySelector('.header__nav-toggle') as HTMLInputElement;
    if (headerNavToggle) {
      if (headerNavToggle.checked) {
        headerNavToggle.checked = false;
      } else {
        headerNavToggle.checked = true;
      }
    }
  }
};

const getInputValue = (name: string, container: Element): string => {
  const input = container.querySelector(`[name="${name}"]`);
  return input instanceof HTMLInputElement || input instanceof HTMLSelectElement ? input.value : '';
};

const lockCheckedSortFilter = (e: Event): void => {
  const element = e.target as HTMLElement;
  const filterToggle = document.getElementById('filter-toggle') as HTMLInputElement;
  const sortToggle = document.getElementById('sort-toggle') as HTMLInputElement;
  console.log(element.className);
  if (element.className === '_lock') {
    filterToggle.checked = true;
    if (filterToggle.checked) {
      filterToggle.checked = false;
    }
    if (sortToggle.checked) {
      sortToggle.checked = false;
    }
    document.body.classList.remove('_lock');
    document.removeEventListener('click', lockCheckedSortFilter);
  } else {
    const parentElement = element.parentNode as HTMLElement;
    const parentElementTwo = parentElement.parentNode as HTMLElement;
    if (parentElementTwo.classList[0] === 'sort-item') {
      document.body.classList.remove('_lock');
      document.removeEventListener('click', lockCheckedSortFilter);
    } else if (element.className === 'sort-toggle__input' || element.className === 'filter-toggle__input') {
      if (!filterToggle.checked && !sortToggle.checked) {
        document.body.classList.remove('_lock');
        document.removeEventListener('click', lockCheckedSortFilter);
      }
    }
  }
};

const sortChecked = (): void => {
  const sortToggle = document.getElementById('sort-toggle') as HTMLInputElement;
  if (sortToggle) {
    if (sortToggle.checked) {
      sortToggle.checked = false;
    } else {
      document.body.classList.add('_lock');
      document.addEventListener('click', lockCheckedSortFilter);
    }
  }
};

const filterChecked = (): void => {
  const filterToggle = document.getElementById('filter-toggle') as HTMLInputElement;
  if (filterToggle) {
    if (filterToggle.checked) {
      filterToggle.checked = false;
    } else {
      document.body.classList.add('_lock');
      document.addEventListener('click', lockCheckedSortFilter);
    }
  }
};

export { adaptiveCloseMenu, getInputValue, sortChecked, filterChecked, lockCheckedSortFilter };
