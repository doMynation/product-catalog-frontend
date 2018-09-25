import React, {Component} from 'react';
import 'whatwg-fetch'
import ProductSearchGrid from "./SearchGrid";
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
import Typography from "@material-ui/core/es/Typography/Typography";
import Section from "../../layout/Section";
import {fetchSharedDataIfNeeded} from "../../shared/index";

const styles = theme => ({
  root: {
    ...theme.layout.pageContainer
  },
  bulkActionMenuContainer: {
    minHeight: theme.spacing.unit * 6
  }
});

class ProductSearchPage extends Component {
  state = {
    isLoading: false,
    selectedBulkAttributes: [],
  };

  componentDidMount() {
    this.props.fetchSharedDataIfNeeded(() => {
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

    this.props.bulkAddAttributes(this.state.selectedBulkAttributes);
    this.props.closeBulkAttributeAddDialog();
    this.setState({selectedBulkAttributes: []});
  }

  handleBulkAttributeClose = () => {
    this.setState(state => ({selectedBulkAttributes: []}), () => {
      this.props.closeBulkAttributeAddDialog();
    });
  }

  render() {
    const {classes, isBulkAttributeAddDialogOpen, selectedProducts, bulkEnable, bulkDisable, showAttributeAddDialog, categories, departments, attributes, stores} = this.props;

    return (
      <div className={classes.root}>
        <BulkAttributeAddDialog
          isOpen={isBulkAttributeAddDialogOpen}
          onClose={this.handleBulkAttributeClose}
          availableAttributes={attributes}
          selectedAttributes={this.state.selectedBulkAttributes}
          onChange={this.handleBulkAttributeChange}
          onSubmit={this.handleBulkAttributeAddSubmit}
        />

        <Grid container>
          <Grid item>
            <PageHeader text="Trouver un produit"/>
          </Grid>

          <Grid item xs={12}>
            <Section>
              <Typography variant="subheading">
                Vous trouvez ci-dessous la liste de tous les produits. Appliquez un ou plusieurs filtres pour rafiner la liste de produits affichés.
              </Typography>
            </Section>
          </Grid>

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

        <Grid container spacing={16}>
          <Hidden smDown>
            <Grid item xs={12} md={2} lg={2}>
              <Paper elevation={8}>
                <TableFilters
                  categories={categories}
                  departments={departments}
                  stores={stores}
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

const mstp = ({shared, productSearch}) => ({
  searchState: productSearch.search,
  products: productSearch.products,
  productsCount: productSearch.productsCount,
  isLoading: productSearch.isLoading,
  isBulkAttributeAddDialogOpen: productSearch.bulkAttributeAdd.isOpen,
  selectedProducts: productSearch.selected,
  categories: shared.data.categories,
  departments: shared.data.departments,
  stores: shared.data.stores,
  attributes: shared.data.attributes,
});

const mdtp = dispatch => ({
  performSearch: () => dispatch(performSearch()),
  bulkAddAttributes: attributes => dispatch(bulkAddAttributes(attributes)),
  closeBulkAttributeAddDialog: () => dispatch(closeBulkAttributeAddDialog()),
  bulkEnable: () => dispatch(bulkEnableProduct()),
  bulkDisable: () => dispatch(bulkDisableProducts()),
  showAttributeAddDialog: () => dispatch(openBulkAttributeAddDialog()),
  fetchSharedDataIfNeeded: onComplete => dispatch(fetchSharedDataIfNeeded(onComplete)),
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(ProductSearchPage);
