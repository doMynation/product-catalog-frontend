import React, {Component} from 'react';
import ProductSearchPage from './pages/ProductSearch/ProductSearchPage'
import ProductEditPage from "./pages/ProductEdit/ProductEditPage";
import {Route} from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Menu from "./layout/Menu";
import Header from "./layout/Header";
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
});

class App extends Component {
  render() {
    const {classes} = this.props;

    return (
      <Grid container className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <Menu/>
          </Grid>

          <Grid item xs={12}>
            <Header/>
          </Grid>

          <Grid item xs={12}>
            <Route exact path="/" component={HomePage}/>
            <Route exact path="/products" component={ProductSearchPage}/>
            <Route path="/products/:productId" component={ProductEditPage}/>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(App);
