import React from 'react';
import ReactDOM from 'react-dom';
import {createBrowserHistory} from "history";
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import theme from './style/theme';
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import createStore from './store';
import Provider from "react-redux/es/components/Provider";
import {ConnectedRouter} from "connected-react-router";
import {setInterceptors as setSessionInterceptors} from "./sessionClient";
import {setInterceptors as setApiInterceptors} from "./apiClient";

const history = createBrowserHistory();
const store = createStore(history)

setSessionInterceptors(store);
setApiInterceptors(store);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <React.Fragment>
          <CssBaseline/>
          <App/>
        </React.Fragment>
      </ConnectedRouter>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

registerServiceWorker();
