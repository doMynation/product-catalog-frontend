import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router'
import shared from './shared/index';
import productSearch from './pages/ProductSearch/index';
import productEdit from './pages/ProductEdit/index';

export default (history) => combineReducers({
  router: connectRouter(history),
  shared,
  productSearch,
  productEdit,
});
