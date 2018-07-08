export const FILTER = 'productSearch/FILTER';
export const RESET = 'productSearch/RESET';
export const SORT = 'productSearch/SORT';
export const CHANGE_PAGE = 'productSearch/CHANGE_PAGE';
export const CHANGE_PAGE_SIZE = 'productSearch/CHANGE_PAGE_SIZE';

export const applyFilters = filters => ({
  type: FILTER,
  filters: filters
});

export const resetSearch = () => ({
  type: RESET
});

export const sortBy = field => ({
  type: SORT,
  field: field
});

export const changePage = page => ({
  type: CHANGE_PAGE,
  page: page
});

export const changePageSize = size => ({
  type: CHANGE_PAGE_SIZE,
  size: size
});

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
      isKit: "",
      isCustom: "",
      isPart: "",
    },
    sortField: "",
    sortOrder: "asc"
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_PAGE_SIZE:
      return {
        ...state,
        search: {
          ...state.search,
          pageSize: action.size,
          page: 0
        }
      };
    case CHANGE_PAGE:
      return {
        ...state,
        search: {
          ...state.search,
          page: action.page
        }
      };
    case SORT:
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
    case RESET:
      return {
        ...state,
        search: {...initialState.search}
      };
    case FILTER:
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