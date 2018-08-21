import {API_KEY, API_URL} from "../conf";
import * as request from "superagent";

class ProductRepository {
  static disableProducts(productIds) {
    const url = `${ProductRepository.baseUrl}/admin/products-bulk/disable`;

    return request
      .patch(url)
      .send({productIds: productIds})
      .set(this._prepHeaders());
  }

  static disableProduct(productId) {
    const url = `${ProductRepository.baseUrl}/admin/products/${productId}/disable`;

    return request
      .patch(url)
      .set(this._prepHeaders());
  }

  static cloneProduct(productId) {
    const url = `${ProductRepository.baseUrl}/admin/products/${productId}/clone`;

    return request
      .post(url)
      .set(this._prepHeaders());
  }

  static searchProducts(filters, sortField, sortDescending, offset, limit) {
    sortField = sortField || null;
    sortDescending = sortDescending || false;
    offset = offset || 0;
    limit = limit || null;

    var params = Object.assign({}, {
      lang: "fr",
      offset: offset
    }, filters);

    if (sortField !== null) {
      params.sort = `${sortDescending ? "-" : ""}${sortField}`;
    }

    if (limit !== null) {
      params.limit = limit;
    }

    const queryStringParams = Object.keys(params).map((key, idx) => {
      return `${key}=${params[key]}`;
    }).join("&");

    const url = `${ProductRepository.baseUrl}/products?${queryStringParams}`;

    return request
      .get(url)
      .set('Accept', 'application/json')
      .set(this._prepHeaders())
  }

  static get(productId) {
    const url = `${ProductRepository.baseUrl}/products/${productId}`;

    return fetch(url, {
      method: "GET",
      headers: this._prepHeaders()
    }).then(resp => resp.json());
  }

  static getEditData(productId) {
    const url = `${ProductRepository.baseUrl}/admin/products/${productId}`;

    return fetch(url, {
      method: "GET",
      headers: this._prepHeaders()
    }).then(resp => resp.json());
  }

  static getProductCategories() {
    const url = `${ProductRepository.baseUrl}/productCategories/all`;

    return fetch(url, {
      method: "GET",
      headers: this._prepHeaders()
    }).then(resp => resp.json()).then(categories => {
      return categories.map(categoryData => {
        const [category, depth] = categoryData;

        return Object.assign({}, category, {depth: depth});
      })
    });
  }

  static getProductDepartments() {
    const url = `${ProductRepository.baseUrl}/productDepartments/all`;

    return fetch(url, {
      method: "GET",
      headers: this._prepHeaders()
    }).then(resp => resp.json());
  }

  static getStores() {
    return new Promise(function (resolve, reject) {
      resolve([
        {id: 1, name: "Solarius"},
        {id: 2, name: "PolySunKit"}
      ]);
    });
  }

  static _prepHeaders() {
    return {
      "X-Api-Key": API_KEY,
      "Content-Type": "application/json"
    };
  }
}

ProductRepository.baseUrl = API_URL;

export default ProductRepository;
