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

const sortChecked = (): void => {
  const sortToggle = document.getElementById('sort-toggle') as HTMLInputElement;
  if (sortToggle) {
    if (sortToggle.checked) {
      sortToggle.checked = false;
    }
  }
};

const filterChecked = (): void => {
  const filterToggle = document.getElementById('filter-toggle') as HTMLInputElement;
  if (filterToggle) {
    if (filterToggle.checked) {
      filterToggle.checked = false;
    }
  }
};

export { adaptiveCloseMenu, getInputValue, sortChecked, filterChecked };
