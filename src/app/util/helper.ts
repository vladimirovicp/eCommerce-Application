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

export { adaptiveCloseMenu, getInputValue };
