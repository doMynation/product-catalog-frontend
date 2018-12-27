import initialState from './initialState';
import {validate} from '../../util/validators';
import form from './form.js';
import ProductRepository from "../../util/ProductRepository";
import {openNotification} from "../../shared/index";

export const INIT = "productEdit/INIT";
export const UPDATE = "productEdit/UPDATE";
export const SAVE_PRODUCT_REQUEST = "productEdit/SAVE_PRODUCT_REQUEST";
export const SAVE_PRODUCT_SUCCESS = "productEdit/SAVE_PRODUCT_SUCCESS";
export const SAVE_PRODUCT_FAILURE = "productEdit/SAVE_PRODUCT_FAILURE";

export const SAVE_DIALOG_OPEN = "productEdit/SAVE_DIALOG_OPEN";
export const SAVE_DIALOG_CLOSE = "productEdit/SAVE_DIALOG_CLOSE";

export const init = data => ({
  type: INIT,
  data
});

export const openSaveDialog = () => ({
  type: SAVE_DIALOG_OPEN
});

export const closeSaveDialog = () => ({
  type: SAVE_DIALOG_CLOSE
});

export const updateField = (fieldName, value, error = "") => ({
  type: UPDATE,
  fieldName,
  value
});

export const saveProduct = () => (dispatch, getState) => {
  dispatch({type: SAVE_PRODUCT_REQUEST});

  const currentState = getState().productEdit;

  // Format data
  const fields = Object.entries(currentState.fields).reduce((acc, [key, field]) => {
    acc[key] = field.export ? field.export(field.value) : field.value;

    return acc;
  }, {});

  ProductRepository
    .updateProduct(currentState.product.id, currentState.product.hash, fields)
    .then(data => {
      // dispatch({type: SAVE_PRODUCT_SUCCESS, hash: data.hash});
      dispatch(openNotification("Le produit a été mis à jour avec succès."))

      // Reload the product and re-initialise the state
      ProductRepository
        .getEditData(currentState.product.id)
        .then(data => {
          dispatch(init(data));
        });
    })
    .catch(err => {
      dispatch(openNotification("Une erreur s'est produite lors de la mise à jour du produit"))
      dispatch({type: SAVE_PRODUCT_FAILURE, error: err});
    });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_DIALOG_OPEN: {
      return {
        ...state,
        isSaveDialogOpen: true
      };
    }
    case SAVE_DIALOG_CLOSE: {
      return {
        ...state,
        isSaveDialogOpen: false
      };
    }
    case SAVE_PRODUCT_SUCCESS: {
      return {
        ...state,
        product: {
          ...state.product,
          hash: action.hash
        }
      };
    }
    case SAVE_PRODUCT_REQUEST: {
      return {
        ...state,
        isSaveButtonVisible: false
      };
    }
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
        isSaveButtonVisible: Object.values(state.fields).every(field => field.error === "" || field.error.length === 0),
        fields: newFields,
      };
    case INIT:
      const {product, translations} = action.data;
      product.translations = translations;

      const fields = Object.assign(...Object.entries(form).map(([key, field]) => {
        const value = field.init(product);

        return {
          [key]: {
            ...field,
            value: value,
            oldValue: value,
            isDirty: true,
            error: "",
          }
        };
      }));

      return {
        ...initialState,
        product: product,
        fields: fields
      };
    default:
      return state;
  }
}
