export const required = value => value ? "" : "Requis";

export const sku = value => {
  if (!/^[\w-]+$/.test(value)) {
    return "Format invalide: Charactères permis: [a-Z0-9_-]";
  }

  return "";
};

export const price = value => {
  if (!/^[\d.]+$/.test(value)) {
    return "Invalide. Doit être numérique.";
  }

  return "";
};

export function validateEmail(value) {
  const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  return regex.test(value);
}

export function validatePassword(value) {
  const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

  return regex.test(value);
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
