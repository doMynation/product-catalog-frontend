import ProductRepository from "./ProductRepository";

export function filterObj(obj, predicate) {
  let newObject = {};

  for (let key in obj) {
    if (predicate(obj[key], key)) {
      newObject[key] = obj[key];
    }
  }

  return newObject;
};

export function firstKey(obj) {
  return Object.keys(obj)[0];
}

export function normalizeList(data, key = "id") {
  return data.reduce((acc, item) => {
    acc[item[key]] = item;

    return acc;
  }, {});
}

export function suggestProduct(needle) {
  return ProductRepository
    .quickSearch(needle)
    .then(resp =>
      resp.body.data.map(product => ({value: product, label: product.description.name}))
    );
};
