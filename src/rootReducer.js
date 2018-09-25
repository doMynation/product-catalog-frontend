import {combineReducers} from 'redux';
import shared from './shared/index';
import productSearch from './pages/ProductSearch/index';
import productEdit from './pages/ProductEdit/index';

export default combineReducers({
  shared,
  productSearch,
  productEdit,
});
