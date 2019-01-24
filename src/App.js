import React, {Component} from 'react';
import ProductSearchPage from './pages/ProductSearch/Page'
import ProductCreatePage from './pages/ProductCreate/Page'
import ProductEditPage from "./pages/ProductEdit/Page";
import HomePage from "./pages/Home/Page";
import LoginPage from "./pages/Auth/LoginPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ProtectedRoute from "./shared/routing/ProtectedRoute";
import GuestOnlyRoute from "./shared/routing/GuestOnlyRoute";
import {Switch} from "react-router-dom";
import ChangePasswordPage from "./pages/Auth/ChangePasswordPage";

class App extends Component {
  render() {
    return (
      <Switch>
        <ProtectedRoute exact path="/" component={HomePage}/>
        <GuestOnlyRoute exact path="/login" fallbackPath="/" component={LoginPage}/>
        <GuestOnlyRoute exact path="/forgot-password" fallbackPath="/" component={ForgotPasswordPage}/>
        <GuestOnlyRoute exact path="/change-password" fallbackPath="/" component={ChangePasswordPage}/>
        <ProtectedRoute path="/products/:productId" component={ProductEditPage}/>
        <ProtectedRoute exact path="/products" component={ProductSearchPage}/>
        <ProtectedRoute exact path="/create-product" component={ProductCreatePage}/>
      </Switch>
    );
  }
}

export default App;
