import {combineReducers} from 'redux';
import layout from './shared/reducers';
import productSearch from './pages/ProductSearch/reducers';

export default combineReducers({
  layout,
  productSearch
});
