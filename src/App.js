import React, {Component} from 'react';
import ProductSearchPage from './pages/ProductSearch/Page'
import ProductCreatePage from './pages/ProductCreate/Page'
import ProductEditPage from "./pages/ProductEdit/Page";
import HomePage from "./pages/Home/Page";
import LoginPage from "./pages/Login/Page";
import ProtectedRoute from "./shared/routing/ProtectedRoute";
import GuestOnlyRoute from "./shared/routing/GuestOnlyRoute";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <ProtectedRoute exact path="/" component={HomePage}/>
        <GuestOnlyRoute exact path="/login" fallbackPath="/" component={LoginPage}/>
        <ProtectedRoute path="/products/:productId" component={ProductEditPage}/>
        <ProtectedRoute exact path="/products" component={ProductSearchPage}/>
        <ProtectedRoute exact path="/create-product" component={ProductCreatePage}/>
      </React.Fragment>
    );
  }
}

export default App;
