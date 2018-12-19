import React, {Component} from 'react';
import ProductSearchPage from './pages/ProductSearch/Page'
import ProductCreatePage from './pages/ProductCreate/Page'
import ProductEditPage from "./pages/ProductEdit/Page";
import HomePage from "./pages/Home/Page";
import LoginPage from "./pages/Login/Page";
import Menu from "./layout/Menu";
import Header from "./layout/Header";
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Notification from "./shared/Notification";
import BgImage from './layout/images/dark-material-bg.jpg';
import ProtectedRoute from "./shared/routing/ProtectedRoute";
import GuestOnlyRoute from "./shared/routing/GuestOnlyRoute";
import Session from "./util/Session";

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
  state = {
    isAuthenticated: false
  };

  componentDidMount() {
    this.setState({isAuthenticated: Session.isAuthenticated()})
  }

  render() {
    const {classes} = this.props;

    return (
      <Grid container direction="column" className={classes.root}>
        <Grid item>
          {this.state.isAuthenticated && (
            <React.Fragment>
              <Header/>
              <Menu/>
            </React.Fragment>
          )}
          <Notification/>
        </Grid>

        <Grid container className={classes.content}>
          <ProtectedRoute exact path="/" component={HomePage}/>
          <GuestOnlyRoute exact path="/login" fallbackPath="/" component={LoginPage}/>
          <ProtectedRoute path="/products/:productId" component={ProductEditPage}/>
          <ProtectedRoute exact path="/products" component={ProductSearchPage}/>
          <ProtectedRoute exact path="/create-product" component={ProductCreatePage}/>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(App);
