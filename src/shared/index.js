import ProductRepository from "../util/ProductRepository";
import {normalizeList} from "../util/functions";

export const FETCH_SHARED_DATA = 'data/FETCH_SHARED_DATA';
export const RECEIVE_SHARED_BASE_DATA = 'data/RECEIVE_SHARED_BASE_DATA';
export const RECEIVE_SHARED_DATA = 'data/RECEIVE_SHARED_DATA';

export const SHOW_UNAUTHORIZED = 'auth/SHOW_UNAUTHORIZED';
export const LEFTMENU_OPEN = 'shared/LEFTMENU_OPEN';
export const LEFTMENU_CLOSE = 'shared/LEFTMENU_CLOSE';
export const NOTIFY_OPEN = 'shared/NOTIFY';
export const NOTIFY_CLOSE = 'shared/NOTIFY_CLOSE';

export const fetchSharedDataIfNeeded = onComplete => {
  return (dispatch, getState) => {
    const sharedData = getState().shared.data;

    if (sharedData.isBaseDataLoaded) {
      onComplete();
      return;
    }

    Promise.all([
      ProductRepository.getProductCategories(),
      ProductRepository.getProductDepartments(),
      ProductRepository.getStores(),
      ProductRepository.getAttributes()
    ]).then(data => {
      const [categories, departments, stores, attributes] = data;

      dispatch(receiveSharedData("categories", normalizeList(categories)));
      dispatch(receiveSharedData("departments", normalizeList(departments)));
      dispatch(receiveSharedData("attributes", normalizeList(attributes)));
      dispatch(receiveSharedData("stores", normalizeList(stores)));
      dispatch(receiveSharedData("stores", normalizeList(stores)));

      onComplete();
    });
  };
}

export const receiveBaseData = (data) => ({
  type: RECEIVE_SHARED_BASE_DATA,
  data
});

export const receiveSharedData = (name, data) => ({
  type: RECEIVE_SHARED_DATA,
  name,
  data
});

export const showUnauthorized = () => ({
  type: SHOW_UNAUTHORIZED
});

export const openMenu = () => ({
  type: LEFTMENU_OPEN
});

export const closeMenu = () => ({
  type: LEFTMENU_CLOSE
});

export const openNotification = (message, positionX = "left", positionY = "bottom", duration = 5000) => ({
  type: NOTIFY_OPEN,
  message,
  positionX,
  positionY,
  duration,
});

export const closeNotification = () => ({
  type: NOTIFY_CLOSE
});

export const initialState = {
  isSessionExpired: false,
  isMenuOpen: false,
  notification: {
    isOpen: false,
    message: "",
    positionX: "left",
    positionY: "bottom",
    duration: 5000,
  },
  isBaseDataLoaded: false,
  data: {
    categories: {},
    departments: {},
    attributes: {},
    stores: {},
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_SHARED_BASE_DATA:
      return {
        ...state,
        isBaseDataLoaded: true,
        data: action.data
      };
    case RECEIVE_SHARED_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          [action.name]: action.data
        }
      };
    case NOTIFY_OPEN:
      return {
        ...state,
        notification: {
          isOpen: true,
          message: action.message,
          positionX: action.positionX,
          positionY: action.positionY,
          duration: action.duration,
        }
      };
    case NOTIFY_CLOSE:
      return {
        ...state,
        notification: {
          ...state.notification,
          isOpen: false
        }
      };
    case SHOW_UNAUTHORIZED:
      return {
        ...state,
        isSessionExpired: true
      };
    case LEFTMENU_OPEN:
      return {
        ...state,
        isMenuOpen: true
      };
    case LEFTMENU_CLOSE:
      return {
        ...state,
        isMenuOpen: false
      };
    default:
      return state;
  }
};
