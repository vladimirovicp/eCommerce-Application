const typeTextToDate = (event?: Event | undefined): void => {
  if (event) {
    const el = event.target as HTMLInputElement;
    if (el) {
      el.type = 'date';
    }
  }
};

const typeDateToText = (event?: Event | undefined): void => {
  if (event) {
    const el = event.target as HTMLInputElement;
    if (el) {
      el.type = 'text';
    }
  }
};

export { typeTextToDate, typeDateToText };
