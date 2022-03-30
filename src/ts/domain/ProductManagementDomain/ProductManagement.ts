import Product from '../Product';
import { validateProductInfo } from './validator';
import { ProductInfo } from '../types';

export default class ProductManagementDomain {
  #products: Product[];

  constructor() {
    this.#products = [];
  }

  get products() {
    return this.#products;
  }

  addProduct(newProduct: ProductInfo) {
    this.#products.push(new Product(newProduct));
  }

  deleteProduct(productName: string) {
    this.#products = this.#products.filter(
      product => product.name !== productName,
    );
  }

  editProduct(prevProductName: string, newProduct: ProductInfo) {
    this.#products.forEach(product => {
      if (product.name === prevProductName) {
        product.editProduct(newProduct);
      }
    });
  }

  validateProductInput(
    product: ProductInfo,
    prevProductName: string | null = null,
  ) {
    validateProductInfo(this.#products, product, prevProductName);
  }
}
