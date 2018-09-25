import React, {Component} from 'react';
import ProductSearchPage from './pages/ProductSearch/Page'
import ProductCreatePage from './pages/ProductCreate/Page'
import ProductEditPage from "./pages/ProductEdit/Page";
import {Route} from "react-router-dom";
import HomePage from "./pages/Home/Page";
import Menu from "./layout/Menu";
import Header from "./layout/Header";
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Notification from "./shared/Notification";
import BgImage from './layout/images/dark-material-bg.jpg';

const styles = theme => ({
  root: {
    height: '100%',
    flexWrap: 'nowrap',
    backgroundImage: `url(${BgImage})`,
    backgroundSize: 'cover',
  },
  content: {
    flexGrow: 1,
  }
});

class App extends Component {
  render() {
    const {classes} = this.props;

    return (
      <Grid container direction="column" className={classes.root}>
        <Grid item>
          <Header/>
          <Menu/>
          <Notification/>
        </Grid>

        <Grid container className={classes.content}>
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/products" component={ProductSearchPage}/>
          <Route exact path="/create-product" component={ProductCreatePage}/>
          <Route path="/products/:productId" component={ProductEditPage}/>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(App);
