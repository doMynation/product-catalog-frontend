import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import theme from './style/theme';
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import {store} from './store';
import Provider from "react-redux/es/components/Provider";
import './index.css';

ReactDOM.render((
  <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <React.Fragment>
          <CssBaseline/>
          <App/>
        </React.Fragment>
      </Provider>
    </MuiThemeProvider>
  </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
