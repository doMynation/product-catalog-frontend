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
import {
  bulkAddAttributes,
  bulkEnableProduct,
  bulkDisableProducts,
  openBulkAttributeAddDialog,
  closeBulkAttributeAddDialog,
  performSearch
} from "./index";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import BulkAttributeAddDialog from "./BulkAttributeAddDialog";
import BulkActionMenu from "./BulkActionMenu";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    width: '100%',
  },
  layout: {
    marginTop: theme.spacing.unit
  },
  bulkActionMenuContainer: {
    minHeight: theme.spacing.unit * 6
  }
});

class ProductSearchPage extends Component {
  state = {
    isLoading: false,
    categories: [],
    departments: [],
    stores: [],
    attributes: [],
    selectedBulkAttributes: [],
  };

  componentDidMount() {
    const getCategories = () => ProductRepository.getProductCategories();
    const getDepartments = () => ProductRepository.getProductDepartments();
    const getStores = () => ProductRepository.getStores();
    const getAttributes = () => ProductRepository.getAttributes();

    Promise.all([getCategories(), getDepartments(), getStores(), getAttributes()]).then(data => {
      const [categories, departments, stores, attributes] = data;

      this.setState({
        categories: categories,
        departments: departments,
        stores: stores,
        attributes: attributes,
      });

      this.props.performSearch();
    });
  }

  handleBulkAttributeChange = attributes => {
    this.setState({selectedBulkAttributes: attributes});
  }

  handleBulkAttributeAddSubmit = () => {
    if (!this.state.selectedBulkAttributes.length) {
      return;
    }

    const selectedAttributes = this.state.selectedBulkAttributes.map(item => ({
      id: this.state.attributes[item.key].id,
      value: item.value,
      isEditable: item.isEditable
    }));

    this.props.bulkAddAttributes(selectedAttributes);
    this.props.closeBulkAttributeAddDialog();
    this.setState({selectedBulkAttributes: []});
  }

  handleBulkAttributeClose = () => {
    this.setState(state => ({selectedBulkAttributes: []}), () => {
      this.props.closeBulkAttributeAddDialog();
    });
  }


  render() {
    const {classes, isBulkAttributeAddDialogOpen, selectedProducts, bulkEnable, bulkDisable, showAttributeAddDialog} = this.props;

    return (
      <div className={classes.root}>
        <BulkAttributeAddDialog
          isOpen={isBulkAttributeAddDialogOpen}
          onClose={this.handleBulkAttributeClose}
          availableAttributes={this.state.attributes}
          selectedAttributes={this.state.selectedBulkAttributes}
          onChange={this.handleBulkAttributeChange}
          onSubmit={this.handleBulkAttributeAddSubmit}
        />

        <PageHeader text="Trouver un produit"/>

        <Grid container>
          <Grid item xs={12} md={2} lg={2}>{''}</Grid>

          <Grid item xs={12} md={10} lg={10}>
            <div className={classes.bulkActionMenuContainer}>
              {selectedProducts.length !== 0 &&
              <BulkActionMenu
                onEnable={bulkEnable}
                onDisable={bulkDisable}
                onAttributeAdd={showAttributeAddDialog}
              />
              }
            </div>
          </Grid>
        </Grid>

        <Grid container className={classes.layout} spacing={16}>
          <Hidden smDown>
            <Grid item xs={12} md={2} lg={2}>
              <Paper elevation={8}>
                <TableFilters
                  categories={this.state.categories}
                  departments={this.state.departments}
                  stores={this.state.stores}
                />
              </Paper>
            </Grid>
          </Hidden>

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
  isBulkAttributeAddDialogOpen: productSearch.bulkAttributeAdd.isOpen,
  selectedProducts: productSearch.selected,
});

const mdtp = dispatch => ({
  performSearch: () => dispatch(performSearch()),
  bulkAddAttributes: attributes => dispatch(bulkAddAttributes(attributes)),
  closeBulkAttributeAddDialog: () => dispatch(closeBulkAttributeAddDialog()),
  bulkEnable: () => dispatch(bulkEnableProduct()),
  bulkDisable: () => dispatch(bulkDisableProducts()),
  showAttributeAddDialog: () => dispatch(openBulkAttributeAddDialog()),
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(ProductSearchPage);
