import ProductRepository from "../util/ProductRepository";
import {normalizeList} from "../util/functions";
import Session from "../util/Session";
import {push} from 'connected-react-router';

export const SIGN_IN = 'auth/SIGN_IN';
export const SIGN_OUT = 'auth/SIGN_OUT';
export const EXPIRE_SESSION = 'auth/EXPIRE_SESSION';
export const ACK_SESSION_EXPIRED = 'auth/ACK_SESSION_EXPIRED';

export const FETCH_SHARED_DATA_REQUEST = 'data/FETCH_SHARED_DATA_REQUEST';
export const FETCH_SHARED_DATA_SUCCESS = 'data/FETCH_SHARED_DATA_SUCCESS';
export const RECEIVE_SHARED_BASE_DATA = 'data/RECEIVE_SHARED_BASE_DATA';

export const LEFTMENU_OPEN = 'shared/LEFTMENU_OPEN';
export const LEFTMENU_CLOSE = 'shared/LEFTMENU_CLOSE';
export const NOTIFY_OPEN = 'shared/NOTIFY';
export const NOTIFY_CLOSE = 'shared/NOTIFY_CLOSE';

export const signIn = user => {
  return dispatch => {
    Session.signIn(user);

    dispatch({type: SIGN_IN, username: user.username});

    // Redirect to home page
    dispatch(push('/'));
  };
};

export const signOut = () => {
  return dispatch => {
    Session.signOut()

    dispatch({type: SIGN_OUT});

    // Redirect to login page
    dispatch(push('/login'));
  };
};

export const fetchSharedDataIfNeeded = onComplete => {
  return (dispatch, getState) => {
    const sharedState = getState().shared;

    if (sharedState.isBaseDataLoaded) {
      onComplete();
      return;
    }

    dispatch({type: FETCH_SHARED_DATA_REQUEST});

    Promise.all([
      ProductRepository.getProductCategories(),
      ProductRepository.getProductDepartments(),
      ProductRepository.getStores(),
      ProductRepository.getAttributes(),
      ProductRepository.getExtrusions(),
    ]).then(data => {
      const [categories, departments, stores, attributes, extrusions] = data;

      dispatch(receiveSharedData("categories", normalizeList(categories)));
      dispatch(receiveSharedData("departments", normalizeList(departments)));
      dispatch(receiveSharedData("attributes", normalizeList(attributes)));
      dispatch(receiveSharedData("stores", normalizeList(stores)));
      dispatch(receiveSharedData("extrusions", normalizeList(extrusions)));
      dispatch({type: RECEIVE_SHARED_BASE_DATA});

      onComplete();
    });
  };
};

export const receiveSharedData = (name, data) => ({
  type: FETCH_SHARED_DATA_SUCCESS,
  name,
  data
});

export const expireSession = () => ({
  type: EXPIRE_SESSION
});

export const acknowledgeSessionExpired = () => {
  return dispatch => {
    dispatch({type: ACK_SESSION_EXPIRED});

    dispatch(push('/login'));
  };
};

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
  isAuthenticated: false,
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
    case SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
      };
    case SIGN_OUT:
      return {
        ...state,
        isAuthenticated: false,
      };
    case RECEIVE_SHARED_BASE_DATA:
      return {
        ...state,
        isBaseDataLoaded: true,
      };
    case FETCH_SHARED_DATA_SUCCESS:
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
    case EXPIRE_SESSION:
      return {
        ...state,
        isSessionExpired: true
      };
    case ACK_SESSION_EXPIRED:
      return {
        ...state,
        isSessionExpired: false,
        isAuthenticated: false,
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
