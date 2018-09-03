import {API_KEY, API_URL} from "../conf";
import * as request from "superagent";

class ProductRepository {
  static addAttributes(productIds, attributes) {
    const url = `${this.baseUrl}/admin/products-bulk/+attributes`;
    const convertedAttributes = attributes.map(att => ({...att, value: att.value + ''}));

    return request
      .patch(url)
      .send({
        productIds: productIds,
        attributes: convertedAttributes
      })
      .set(this._prepHeaders());
    // @todo: Handle 500 errors
  }

  static enableProducts(productIds) {
    const url = `${this.baseUrl}/admin/products-bulk/enable`;

    return request
      .patch(url)
      .send({productIds: productIds})
      .set(this._prepHeaders());
  }

  static disableProducts(productIds) {
    const url = `${this.baseUrl}/admin/products-bulk/disable`;

    return request
      .patch(url)
      .send({productIds: productIds})
      .set(this._prepHeaders());
  }

  static enableProduct(productId) {
    const url = `${this.baseUrl}/admin/products/${productId}/enable`;

    return request
      .patch(url)
      .set(this._prepHeaders());
  }

  static disableProduct(productId) {
    const url = `${this.baseUrl}/admin/products/${productId}/disable`;

    return request
      .patch(url)
      .set(this._prepHeaders());
  }

  static cloneProduct(productId) {
    const url = `${this.baseUrl}/admin/products/${productId}/clone`;

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

    const url = `${this.baseUrl}/products?${queryStringParams}`;

    return request
      .get(url)
      .set('Accept', 'application/json')
      .set(this._prepHeaders())
  }

  static get(productId) {
    const url = `${this.baseUrl}/products/${productId}`;

    return fetch(url, {
      method: "GET",
      headers: this._prepHeaders()
    }).then(resp => resp.json());
  }

  static getEditData(productId) {
    const url = `${this.baseUrl}/admin/products/${productId}`;

    return fetch(url, {
      method: "GET",
      headers: this._prepHeaders()
    }).then(resp => resp.json());
  }

  static getProductCategories() {
    const url = `${this.baseUrl}/productCategories/all`;

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

  static getAttributes() {
    const url = `${this.baseUrl}/attributes/all?lang=fr`;

    return request
      .get(url)
      .set('Accept', 'application/json')
      .set(this._prepHeaders())
      .then(resp => resp.body);
  }

  static getProductDepartments() {
    const url = `${this.baseUrl}/productDepartments/all?lang=fr`;

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
