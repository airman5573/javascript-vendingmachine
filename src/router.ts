import RouteComponent from './abstract/route-component';

class Router {
  static _instance?: Router;

  private listeners: Array<RouteComponent> = [];

  constructor() {
    if (Router._instance) {
      return Router._instance;
    }
    window.addEventListener('load', this.onLocationChange);
    window.addEventListener('pushstate', this.onLocationChange);
    window.addEventListener('popstate', this.onLocationChange);
  }

  static get instance() {
    if (!Router._instance) {
      Router._instance = new Router();
    }
    return Router._instance;
  }

  static pushState(url: string) {
    history.pushState({}, '', url);
    window.dispatchEvent(new Event('pushstate'));
  }

  addListener(component: RouteComponent) {
    this.listeners.push(component);
  }

  getCurrentPath() {
    const { pathname } = window.location;
    return pathname;
  }

  onLocationChange = () => {
    this.notify();
  };

  notify() {
    this.listeners.forEach((component) => component.onLocationChange());
  }
}

export default Router;
