import {createStore, applyMiddleware} from 'redux';
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';
import compose from "redux/src/compose";
import {initialState as sharedState} from "./shared/index";
import Session from "./util/Session";
import {routerMiddleware} from 'connected-react-router'

export default (history) => createStore(
  rootReducer(history),
  {
    shared: {
      ...sharedState,
      isAuthenticated: Session.isAuthenticated()
    }
  },
  compose(
    applyMiddleware(
      thunk,
      routerMiddleware(history),
    ),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  )
);

