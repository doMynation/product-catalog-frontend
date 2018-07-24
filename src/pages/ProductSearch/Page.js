import React, {Component} from 'react';
import 'whatwg-fetch'
import ProductSearchGrid from "./SearchGrid";
import ProductRepository from "../../util/ProductRepository";
import Paper from "@material-ui/core/es/Paper/Paper";
import withStyles from "@material-ui/core/es/styles/withStyles";
import PageHeader from "../../layout/PageHeader";
import Grid from "@material-ui/core/es/Grid/Grid";
import TableFilters from "./TableFilters";
import compose from "redux/src/compose";
import connect from "react-redux/es/connect/connect";
import {performSearch} from "./index";

const styles = theme => ({
  root: {
    padding: 20
  },
  layout: {
    marginTop: 10
  }
});

class ProductSearchPage extends Component {
  state = {
    isLoading: false,
    categories: [],
    departments: [],
    stores: []
  };

  componentDidMount() {
    const getCategories = () => ProductRepository.getProductCategories();
    const getDepartments = () => ProductRepository.getProductDepartments();
    const getStores = () => ProductRepository.getStores();

    Promise.all([getCategories(), getDepartments(), getStores()]).then(data => {
      const [categories, departments, stores] = data;

      this.setState({
        categories: categories,
        departments: departments,
        stores: stores,
      });

      this.props.dispatch(performSearch());
    });
  }

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <PageHeader text="Rechercher un produit"></PageHeader>
        <Grid container spacing={16} className={classes.layout}>
          <Grid item xs={12} md={2} lg={2}>
            <Paper elevation={8}>
              <TableFilters
                categories={this.state.categories}
                departments={this.state.departments}
                stores={this.state.stores}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={10} lg={10}>
            <Paper elevation={8}>
              <ProductSearchGrid
                isLoading={this.props.isLoading}
                data={this.props.products}
                rowsCount={this.props.productsCount}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mstp = ({productSearch}) => ({
  searchState: productSearch.search,
  products: productSearch.products,
  productsCount: productSearch.productsCount,
  isLoading: productSearch.isLoading,
});

export default compose(
  withStyles(styles),
  connect(mstp, null)
)(ProductSearchPage);
