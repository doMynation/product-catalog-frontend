import ProductRepository from "../../util/ProductRepository";
import {openNotification, showUnauthorized} from "../../shared/index";

export const FILTER = 'productSearch/FILTER';
export const RESET = 'productSearch/RESET';
export const SORT = 'productSearch/SORT';
export const CHANGE_PAGE = 'productSearch/CHANGE_PAGE';
export const CHANGE_PAGE_SIZE = 'productSearch/CHANGE_PAGE_SIZE';

export const SEARCH_START = 'productSearch/SEARCH_START';
export const SEARCH_SUCCESS = 'productSearch/SEARCH_SUCCESS';

export const SELECT = 'productSearch/SELECT';
export const SELECT_ALL = 'productSearch/SELECT_ALL';

export const UPDATE_SUCCESS = 'productSearch/UPDATE_SUCCESS';
export const BULK_UPDATE_SUCCESS = 'productSearch/BULK_UPDATE_SUCCESS';

export const CLONE_START = 'productSearch/CLONE_START';
export const CLONE_ERROR = 'productSearch/CLONE_ERROR';

export const DELETE_START = 'productSearch/DELETE_START';
export const DELETE_ERROR = 'productSearch/DELETE_ERROR';

export const BULK_DISABLE_START = 'productSearch/BULK_DISABLE_START';
export const BULK_DISABLE_ERROR = 'productSearch/BULK_DISABLE_ERROR';

export const selectAll = () => ({
  type: SELECT_ALL,
});

export const selectProduct = index => ({
  type: SELECT,
  index
});

export const cloneProduct = productId => {
  return dispatch => {
    dispatch({type: CLONE_START});

    ProductRepository.cloneProduct(productId)
      .then(resp => {
        dispatch(openNotification(`Le produit [${resp.body.sku}] a été créé avec succès.`));
        dispatch(performSearch());
      })
      .catch(err => {
        dispatch({type: CLONE_ERROR, message: err.message});
      });
  };
}

export const bulkDisableProducts = () => {
  return (dispatch, getState) => {
    const selectedProductIndices = getState().productSearch.selected;

    // Do nothing when no product is selected
    if (selectedProductIndices.length === 0) {
      return;
    }

    // Get the list of matching products
    const products = getState().productSearch.products;
    const selectedProductIds = selectedProductIndices.map(index => products[index].id);

    dispatch({type: BULK_DISABLE_START});

    ProductRepository.disableProducts(selectedProductIds)
      .then(resp => {
        dispatch({type: BULK_UPDATE_SUCCESS, productIds: selectedProductIds});
        dispatch(openNotification(`Les produits ${selectedProductIds.join(", ")} ont été supprimés.`));
        dispatch(performSearch());
      })
      .catch(err => {
        dispatch({type: BULK_DISABLE_ERROR, message: err.message});
      });
  };
};

export const deleteProduct = productId => {
  return dispatch => {
    dispatch({type: DELETE_START});

    // Delete the product
    ProductRepository.disableProduct(productId)
      .then(resp => {
        dispatch({type: UPDATE_SUCCESS, productId});
        dispatch(openNotification(`Le produit ${productId} a été supprimé.`));
        dispatch(performSearch());
      })
      .catch(err => {
        dispatch({type: DELETE_ERROR, message: err.message})
      });
  };
};

export const performSearch = () => {
  return (dispatch, getState) => {
    const state = getState().productSearch.search;
    const offset = state.page * state.pageSize;

    let sortField = null;
    let sortDescending = null;

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
        console.log("hmm what", err.response);
        if (err.timeout) {
          console.log("handle timeout");
        } else if (!("response" in err)) {
          dispatch(showUnauthorized());
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
      storeId: "",
      category: "",
      department: "",
      isKit: "",
      isCustom: "",
      isEnabled: "1",
    },
    sortField: "",
    sortOrder: "asc"
  },
  products: [],
  selected: [],
  recentlyUpdated: [],
  productsCount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_ALL:
      const isAllSelected = state.products.length === state.selected.length;

      return {
        ...state,
        selected: isAllSelected ? [] : state.products.map((product, idx) => idx)
      };
    case SELECT:
      const isSelected = state.selected.indexOf(action.index) !== -1;
      const newSelected = isSelected ?
        state.selected.filter(idx => idx !== action.index) :
        state.selected.concat([action.index]);

      return {
        ...state,
        selected: newSelected
      };
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
        selected: [],
        isLoading: false,
        products: action.products,
        productsCount: action.productsCount,
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        recentlyUpdated: state.recentlyUpdated.concat([action.productId])
      };
    case BULK_UPDATE_SUCCESS:
      return {
        ...state,
        recentlyUpdated: state.recentlyUpdated.concat(action.productIds)
      };
    default:
      return state;
  }
};
