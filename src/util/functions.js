import ProductRepository from "./ProductRepository";

export function normalizeList(data, key = "id") {
  return data.reduce((acc, item) => {
    acc[item[key]] = item;

    return acc;
  }, {});
}

export function suggestProduct(needle) {
  return ProductRepository
    .quickSearch(needle)
    .then(products =>
      products.map(product => ({value: product, label: product.description.name}))
    );
};
