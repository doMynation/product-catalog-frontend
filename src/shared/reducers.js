export const initialState = {
  isMenuOpen: false
};

export default (state = initialState, action) => {
  switch (action.type) {
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
