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
