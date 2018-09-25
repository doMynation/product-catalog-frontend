import initialState from './initialState';
import {validate} from '../../util/validators';
import form from './form.js';

export const INIT = "productEdit/INIT";
export const UPDATE = "productEdit/UPDATE";

export const init = data => ({
  type: INIT,
  data
});

export const updateField = (fieldName, value, error = "") => ({
  type: UPDATE,
  fieldName,
  value
});


export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE:
      // Perform validation
      const field = state.fields[action.fieldName];
      const error = field.isDirty ? validate(action.value, field) : "";

      const newFields = {
        ...state.fields,
        [action.fieldName]: {
          ...field,
          isDirty: true,
          value: action.value,
          error: error
        }
      };

      return {
        ...state,
        fields: newFields,
      };
    case INIT:
      const {product, translations} = action.data;
      const fields = Object.assign(...Object.entries(form).map(([key, field]) => {
        const value = field.init(product);

        return {
          [key]: {
            ...field,
            value: value,
            oldValue: value,
            isDirty: false,
            error: "",
          }
        };
      }));

      return {
        ...state,
        product: product,
        fields: fields
      };
    default:
      return state;
  }
}
