import sessionClient from '../sessionClient';
import apiClient from '../apiClient';

class ProductRepository {
  static updateProduct(productId, hash, fields) {

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

    return sessionClient
      .put(`/admin/products/${productId}`, {
        fields: formattedFields
      });
  }

  static addAttributes(productIds, attributes) {
    const url = `/admin/products-bulk/+attributes`;
    const convertedAttributes = attributes.map(att => ({...att, value: att.value + ''}));

    return sessionClient
      .patch(url, {
        productIds: productIds,
        attributes: convertedAttributes
      });
  }

  static enableProducts(productIds) {
    return sessionClient
      .patch('/admin/products-bulk/enable', {
        productIds: productIds
      });
  }

  static disableProducts(productIds) {
    return sessionClient
      .patch('/admin/products-bulk/disable', {
        productIds: productIds
      });
  }

  static enableProduct(productId) {
    return sessionClient
      .patch(`/admin/products/${productId}/enable`);
  }

  static disableProduct(productId) {
    return sessionClient
      .patch(`/admin/products/${productId}/disable`);
  }

  static cloneProduct(productId) {
    return sessionClient
      .post(`/admin/products/${productId}/clone`);
  }

  static quickSearch(needle) {
    return this
      .searchProducts({nameSku: needle})
      .then(data => data.data);
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

    return apiClient
      .get(`/products?${queryStringParams}`);
  }

  static get(productId) {
    return apiClient
      .get(`/products/${productId}`);
  }

  static getEditData(productId) {
    return sessionClient
      .get(`/admin/products/${productId}`)
      .then(data => data.data);
  }

  static getProductCategories() {
    return apiClient
      .get('productCategories/all')
      .then(categories => categories.map(categoryData => {
        const [category, depth] = categoryData;

        return Object.assign({}, category, {depth: depth});
      }));
  }

  static getAttributes() {
    return apiClient
      .get('/attributes/all?lang=fr');
  }

  static getExtrusions() {
    return apiClient
      .get('/extrusions/all');
  }

  static getProductDepartments() {
    return apiClient
      .get(`/productDepartments/all?lang=fr`);
  }

  // @todo
  static getStores() {
    return new Promise(function (resolve, reject) {
      resolve([
        {id: 1, name: "Solarius"},
        {id: 2, name: "PolySunKit"}
      ]);
    });
  }
}

export default ProductRepository;
