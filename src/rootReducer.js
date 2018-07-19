import {combineReducers} from 'redux';
import shared from './shared/index';
import productSearch from './pages/ProductSearch/index';

export default combineReducers({
  shared,
  productSearch
});
