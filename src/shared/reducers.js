export const SHOW_UNAUTHORIZED = 'auth/SHOW_UNAUTHORIZED';

export const showUnauthorized = () => ({
  type: SHOW_UNAUTHORIZED
});

export const initialState = {
  isSessionExpired: false,
  isMenuOpen: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_UNAUTHORIZED:
      return {
        ...state,
        isSessionExpired: true
      };
    case "SHOW_MENU":
      return {
        ...state,
        isMenuOpen: true
      };
    case "HIDE_MENU":
      return {
        ...state,
        isMenuOpen: false
      };
    default:
      return state;
  }
};
