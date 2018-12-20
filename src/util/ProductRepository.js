import {API_KEY, API_URL} from "../conf";
import * as request from "superagent";

// @todo: Handle 500 errors
// @todo: Handle timeouts

class ProductRepository {
  static updateProduct(productId, hash, fields) {
    const url = `${this.baseUrl}/admin/products/${productId}`;

    // Curate the data in the proper format
    // @todo: Fix this permanently (via form.js @ export? fnc)
    const formattedFields = {
      ...fields,
      hash: hash,
      metadata: {
        mpn: fields.mpn,
        isKit: fields.isKit ? "1" : "0",
        imageUrl: fields.imageUrl,
        stickerId: "" + fields.stickerId,
        extrusionId: "" + fields.extrusionId,
      }
    };

    return request
      .put(url)
      .send({fields: formattedFields})
      .set('Accept', 'application/json')
      .set(this._prepHeaders());
  }

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
      .set('Accept', 'application/json')
      .set(this._prepHeaders());
  }

  static quickSearch(needle) {
    return this.searchProducts({nameSku: needle});
  }

  static searchProducts(filters, sortField, sortDescending, offset, limit) {
    sortField = sortField || null;
    sortDescending = sortDescending || false;
    offset = offset || 0;
    limit = limit || null;

    const params = Object.assign({}, {
      lang: "fr",
      offset: offset
    }, filters);

    if (sortField !== null) {
      params.sort = `${sortDescending ? "-" : ""}${sortField}`;
    }

    if (limit !== null) {
      params.limit = limit;
    }

    const queryStringParams = Object.keys(params).map(key => {
      return `${key}=${params[key]}`;
    }).join("&");

    const url = `${this.baseUrl}/products?${queryStringParams}`;

    return this.prep(
      request
        .get(url)
        .set(this._prepHeaders())
    );
  }

  static get(productId) {
    const url = `${this.baseUrl}/products/${productId}`;

    return request()
      .get(url)
      .set(this._prepHeaders())
      .then(resp => resp.body);
  }

  static getEditData(productId) {
    const url = `${this.baseUrl}/admin/products/${productId}`;

    return this.prep(request.get(url))
      .then(resp => resp.body);
  }

  static getProductCategories() {
    const url = `${this.baseUrl}/productCategories/all`;

    return request
      .get(url)
      .set('Accept', 'application/json')
      .set(this._prepHeaders())
      .then(resp => resp.body.map(categoryData => {
        const [category, depth] = categoryData;

        return Object.assign({}, category, {depth: depth});
      }));
  }

  static getAttributes() {
    const url = `${this.baseUrl}/attributes/all?lang=fr`;

    return request
      .get(url)
      .set('Accept', 'application/json')
      .set(this._prepHeaders())
      .then(resp => resp.body);
  }

  static getExtrusions() {
    const url = `${this.baseUrl}/extrusions/all`;

    return request
      .get(url)
      .set('Accept', 'application/json')
      .set(this._prepHeaders())
      .then(resp => resp.body);
  }

  static getProductDepartments() {
    const url = `${this.baseUrl}/productDepartments/all?lang=fr`;

    return request
      .get(url)
      .set('Accept', 'application/json')
      .set(this._prepHeaders())
      .then(resp => resp.body);
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

  static prep(request) {
    return request
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .withCredentials();
  }
}

ProductRepository.baseUrl = API_URL;

export default ProductRepository;
