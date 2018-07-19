export const SHOW_UNAUTHORIZED = 'auth/SHOW_UNAUTHORIZED';
export const LEFTMENU_OPEN = 'shared/LEFTMENU_OPEN';
export const LEFTMENU_CLOSE = 'shared/LEFTMENU_CLOSE';
export const NOTIFY_OPEN = 'shared/NOTIFY';
export const NOTIFY_CLOSE = 'shared/NOTIFY_CLOSE';

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
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
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
