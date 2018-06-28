export default (state = [], action) => {
  switch (action.type) {
    case "TOGGLE_MENU":
      return {
        isVisible: action.isVisible
      };
    default:
      return state;
  }
};
