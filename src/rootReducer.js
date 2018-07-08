import {combineReducers} from 'redux';
import layout from './shared/reducers';
import productSearch from './pages/ProductSearch/index';

export default combineReducers({
  layout,
  productSearch
});
