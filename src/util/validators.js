export const required = value => value ? "" : "Requis";

export const sku = value => {
  if (!/^[\w-]+$/.test(value)) {
    return "Format invalide: Charactères permis: [a-Z0-9_-]";
  }

  return "";
}

export const price = value => {
  if (!/^[\d.]+$/.test(value)) {
    return "Invalide. Doit être numérique.";
  }

  return "";
}

export const compareBooleans = (booleanValue, stringValue) => {
  const booleanStringValue = stringValue === "1";

  return booleanValue === booleanStringValue;
}

export const compareArrays = (a, b) => {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

export const validate = (value, field) => {
  if (field.validators === undefined || !field.validators.length) {
    return "";
  }

  for (const validator of field.validators) {
    const error = validator(value);
    if (error !== "") {
      return error;
    }
  }

  return "";
};
