import ProductRepository from "../../util/ProductRepository";
import {openNotification, showUnauthorized} from "../../shared/index";
import initialState from './initialState';

export const FILTER = 'productSearch/FILTER';
export const RESET = 'productSearch/RESET';
export const SORT = 'productSearch/SORT';
export const CHANGE_PAGE = 'productSearch/CHANGE_PAGE';
export const CHANGE_PAGE_SIZE = 'productSearch/CHANGE_PAGE_SIZE';

export const BULK_ATTRIBUTE_ADD_OPEN = 'productSearch/bulkAttributeAdd/OPEN';
export const BULK_ATTRIBUTE_ADD_CLOSE = 'productSearch/bulkAttributeAdd/CLOSE';

export const SEARCH_START = 'productSearch/SEARCH_START';
export const SEARCH_SUCCESS = 'productSearch/SEARCH_SUCCESS';

export const SELECT = 'productSearch/SELECT';
export const SELECT_ALL = 'productSearch/SELECT_ALL';

export const UPDATE_SUCCESS = 'productSearch/UPDATE_SUCCESS';
export const UPDATE_ERROR = 'productSearch/UPDATE_ERROR';

export const CLONE_START = 'productSearch/CLONE_START';
export const CLONE_ERROR = 'productSearch/CLONE_ERROR';

export const BULK_ACTION_START = 'productSearch/BULK_ACTION_START';
export const BULK_UPDATE_SUCCESS = 'productSearch/BULK_UPDATE_SUCCESS';
export const BULK_ACTION_ERROR = 'productSearch/BULK_ACTION_ERROR';

export const openBulkAttributeAddDialog = () => ({
  type: BULK_ATTRIBUTE_ADD_OPEN
});

export const closeBulkAttributeAddDialog = () => ({
  type: BULK_ATTRIBUTE_ADD_CLOSE
});

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
        dispatch(openNotification(`Le produit [${resp.body.data.sku}] a été créé avec succès.`));
        dispatch(performSearch());
      })
      .catch(err => {
        dispatch({type: CLONE_ERROR, message: err.message});
      });
  };
};

export const bulkAddAttributes = attributes => {
  return (dispatch, getState) => {
    const selectedProductIndices = getState().productSearch.selected;

    // Do nothing when no product is selected
    if (selectedProductIndices.length === 0) {
      return;
    }

    // Get the list of matching products
    const products = getState().productSearch.products;
    const selectedProductIds = selectedProductIndices.map(index => products[index].id);

    dispatch({type: BULK_ACTION_START});

    ProductRepository.addAttributes(selectedProductIds, attributes)
      .then(resp => {
        dispatch({type: BULK_UPDATE_SUCCESS, productIds: selectedProductIds});
        dispatch(openNotification(`Les attributs ont été ajoutés aux produits sélectionnés.`));
        // dispatch(performSearch());
      })
      .catch(err => dispatch({type: BULK_ACTION_ERROR}));
  }
};

export const bulkEnableProduct = () => {
  return (dispatch, getState) => {
    const selectedProductIndices = getState().productSearch.selected;

    // Do nothing when no product is selected
    if (selectedProductIndices.length === 0) {
      return;
    }

    // Get the list of matching products
    const products = getState().productSearch.products;
    const selectedProductIds = selectedProductIndices.map(index => products[index].id);

    dispatch({type: BULK_ACTION_START});

    ProductRepository.enableProducts(selectedProductIds)
      .then(resp => {
        dispatch({type: BULK_UPDATE_SUCCESS, productIds: selectedProductIds});
        dispatch(openNotification(`Les produits ${selectedProductIds.join(", ")} ont été ré-activés.`));
        dispatch(performSearch());
      })
      .catch(err => dispatch({type: BULK_ACTION_ERROR, message: err.message}));
  };
};

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

    dispatch({type: BULK_ACTION_START});

    ProductRepository.disableProducts(selectedProductIds)
      .then(resp => {
        dispatch({type: BULK_UPDATE_SUCCESS, productIds: selectedProductIds});
        dispatch(openNotification(`Les produits ${selectedProductIds.join(", ")} ont été désactivés.`));
        dispatch(performSearch());
      })
      .catch(err => {
        dispatch({type: BULK_ACTION_ERROR, message: err.message});
      });
  };
};

export const enableProduct = productId => {
  return dispatch => {
    ProductRepository.enableProduct(productId)
      .then(resp => {
        dispatch({type: UPDATE_SUCCESS, productId});
        dispatch(openNotification(`Le produit ${productId} a été ré-activé.`));
        dispatch(performSearch());
      })
      .catch(err => {
        dispatch({type: UPDATE_ERROR, message: err.message})
      });
  };
};

export const disableProduct = productId => {
  return dispatch => {
    ProductRepository.disableProduct(productId)
      .then(resp => {
        dispatch({type: UPDATE_SUCCESS, productId});
        dispatch(openNotification(`Le produit ${productId} a été désactivé.`));
        dispatch(performSearch());
      })
      .catch(err => {
        dispatch({type: UPDATE_ERROR, message: err.message})
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
        const json = resp.body;

        dispatch(receiveResults(json.data, json.meta.count));
      })
      .catch(err => {
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
    case BULK_ATTRIBUTE_ADD_OPEN:
      return {
        ...state,
        bulkAttributeAdd: {
          ...state.bulkAttributeAdd,
          isOpen: true
        }
      };
    case BULK_ATTRIBUTE_ADD_CLOSE:
      return {
        ...state,
        bulkAttributeAdd: {
          ...state.bulkAttributeAdd,
          isOpen: false
        }
      };
    default:
      return state;
  }
};
