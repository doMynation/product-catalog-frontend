export const initialState = {
  isAdvancedSearchOpen: false,
  search: {
    count: 0,
    page: 0,
    pageSize: 25,
    filters: {
      id: "",
      sku: "",
      name: "",
      category: "",
      department: "",
    },
    sortField: "",
    sortOrder: "asc"
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_PAGE_SIZE":
      return {
        ...state,
        search: {
          ...state.search,
          pageSize: action.size,
          page: 0
        }
      };
    case "CHANGE_PAGE":
      return {
        ...state,
        search: {
          ...state.search,
          page: action.page
        }
      };
    case "SORT_BY":
      const newOrder = state.search.sortField === action.field && state.search.sortOrder === "asc" ? "desc" : "asc";

      return {
        ...state,
        search: {
          ...state.search,
          sortField: action.field,
          sortOrder: newOrder,
          page: 0,
        }
      };
    case "RESET_SEARCH":
      return {
        ...state,
        search: {...initialState.search}
      };
    case "TOGGLE_ADVANCED_FILTERS":
      return {
        ...state,
        isAdvancedSearchOpen: action.isOpen
      };
    case "APPLY_FILTERS":
      return {
        ...state,
        search: {
          ...state.search,
          filters: action.filters,
          page: 0,
        }
      };
    default:
      return state;
  }
};
