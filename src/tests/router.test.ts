import { Pages } from '../app/router/pages';
import Router from '../app/router/router';

const mockRoutes = [
  { path: `${Pages.HOME}`, callback: jest.fn() },
  { path: `${Pages.ABOUT}`, callback: jest.fn() },
  { path: 'product/1', callback: jest.fn() },
  { path: `${Pages.NOT_FOUND}`, callback: jest.fn() },
];

describe('Router testing', () => {
  let router: Router;

  beforeEach(() => {
    jest.spyOn(window, 'addEventListener');
    jest.spyOn(window.history, 'pushState').mockImplementation(() => {});
    router = new Router(mockRoutes);
  });

  it('should navigate to the correct route on navigate', () => {
    router.navigate('about');
    expect(mockRoutes[1].callback).toHaveBeenCalled();
    expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/about');
  });

  it('should handle not found route', () => {
    router.navigate('unknown');
    expect(mockRoutes[3].callback).toHaveBeenCalled();
  });

  it('should handle not found route on navigateOnload', () => {
    router['navigateOnload']('non_existent');
    expect(mockRoutes[3].callback).toHaveBeenCalled();
  });

  it('should parse the URL correctly', () => {
    const parsedUrl = router['parseUrl']('product/123');
    expect(parsedUrl).toEqual({ pageName: 'product', productId: '123' });
  });
});
