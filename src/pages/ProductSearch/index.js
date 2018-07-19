import ProductRepository from "../../util/ProductRepository";
import {openNotification, showUnauthorized} from "../../shared/index";

export const FILTER = 'productSearch/FILTER';
export const RESET = 'productSearch/RESET';
export const SORT = 'productSearch/SORT';
export const CHANGE_PAGE = 'productSearch/CHANGE_PAGE';
export const CHANGE_PAGE_SIZE = 'productSearch/CHANGE_PAGE_SIZE';

export const SEARCH_START = 'productSearch/SEARCH_START';
export const SEARCH_SUCCESS = 'productSearch/SEARCH_SUCCESS';

export const DUPLICATE_START = 'productSearch/DUPLICATE_START';
export const DUPLICATE_SUCCESS = 'productSearch/DUPLICATE_SUCCESS';
export const DUPLICATE_ERROR = 'productSearch/DUPLICATE_ERROR';

export const DELETE_START = 'productSearch/DELETE_START';
export const DELETE_SUCCESS = 'productSearch/DELETE_SUCCESS';
export const DELETE_ERROR = 'productSearch/DELETE_ERROR';

export const duplicateProduct = productId => {
  return dispatch => {
    dispatch({type: DELETE_START});

    // Delete the product
    ProductRepository.deleteProduct(productId)
      .then(resp => {
        dispatch({type: DELETE_SUCCESS});
        dispatch(performSearch());
      })
      .catch(err => dispatch({type: DELETE_ERROR, message: err.message}));
  };
}
export const deleteProduct = productId => {
  return dispatch => {
    dispatch({type: DELETE_START});

    // Delete the product
    ProductRepository.deleteProduct(productId)
      .then(resp => {
        dispatch({type: DELETE_SUCCESS});
        dispatch(performSearch());
      })
      .catch(err => {
        dispatch(openNotification(`Le produit ${productId} a été supprimé.`));
        dispatch({type: DELETE_ERROR, message: err.message})
      });
  };
}

export const performSearch = () => {
  return (dispatch, getState) => {
    const state = getState().productSearch.search;
    const offset = state.page * state.pageSize;

    var sortField = null;
    var sortDescending = null;

    if (state.sortField !== null) {
      sortField = state.sortField;
      sortDescending = state.sortOrder === "desc";
    }

    // Filters (exclude empty ones)
    let filters = {};
    for (let key in state.filters) {
      if (state.filters[key] !== "") {
        filters[key] = state.filters[key];
      }
    }

    dispatch({type: SEARCH_START});

    ProductRepository.searchProducts(filters, sortField, sortDescending, offset, state.pageSize)
    // .timeout(2000)
      .then(resp => {
        const searchResult = resp.body;

        dispatch(receiveResults(searchResult.results, searchResult.totalCount));
      })
      .catch(err => {
        if (err.timeout) {
          console.log("handle timeout");
        } else if (err.response.unauthorized) {
          dispatch(showUnauthorized());
        } else if (err.response.forbidden) {
          console.log("handle forbidden");
        }
      });
  };
};

export const receiveResults = (products, productsCount) => ({
  type: SEARCH_SUCCESS,
  products,
  productsCount
});

export const applyFilters = filters => {
  return (dispatch) => {
    dispatch({type: FILTER, filters});
    dispatch(performSearch());
  };
};

export const resetSearch = () => {
  return (dispatch) => {
    dispatch({type: RESET});
    dispatch(performSearch());
  };
};

export const sortBy = field => {
  return (dispatch) => {
    dispatch({type: SORT, field});
    dispatch(performSearch());
  };
};

export const changePage = page => {
  return (dispatch) => {
    dispatch({type: CHANGE_PAGE, page});
    dispatch(performSearch());
  };
};

export const changePageSize = size => {
  return (dispatch) => {
    dispatch({type: CHANGE_PAGE_SIZE, size});
    dispatch(performSearch());
  };
};

export const initialState = {
  isAdvancedSearchOpen: false,
  isLoading: false,
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
  },
  products: [],
  productsCount: 0,
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
    case SEARCH_START:
      return {
        ...state,
        isLoading: true
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        products: action.products,
        productsCount: action.productsCount,
      };
    default:
      return state;
  }
};
