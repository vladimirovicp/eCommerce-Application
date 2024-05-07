import ElementCreator from './element-creator';
import { LinkImageData, LinkParams } from './types';

class LinkCreator extends ElementCreator<HTMLAnchorElement> {
  constructor(params: LinkParams) {
    super({
      tag: 'a',
      classNames: params.classNames,
      textContent: params.textContent,
      attributes: params.attributes,
      callback: params.callback,
    });

    if (params.imageData) this.addImageToLink(params.imageData);
  }

  private addImageToLink(imageData: LinkImageData): void {
    this.element.textContent = '';

    const container = document.createElement('div');
    if (imageData.containerClassNames) {
      container.className = imageData.containerClassNames;
    }

    const image = document.createElement('img');
    if (imageData.imageClassNames) {
      image.className = imageData.imageClassNames;
    }
    image.src = imageData.src;
    image.alt = imageData.alt;

    container.appendChild(image);

    this.element.appendChild(container);
  }
}

export default LinkCreator;
