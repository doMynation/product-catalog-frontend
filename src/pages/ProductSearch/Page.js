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
import {bulkAddAttributes, closeBulkAttributeAddDialog, performSearch} from "./index";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/es/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/es/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/es/DialogActions/DialogActions";
import Button from "@material-ui/core/es/Button/Button";
import AttributePicker from "../../shared/AttributePicker";


const styles = theme => ({
  dialogPaper: {},
  root: {
    padding: theme.spacing.unit * 3,
    width: '100%',
  },
  layout: {
    marginTop: theme.spacing.unit
  },
  modal: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  }
});

class ProductSearchPage extends Component {
  state = {
    bulkAttributes: [],
    isLoading: false,
    categories: [],
    departments: [],
    stores: [],
    attributes: []
  };

  handleBulkAttributeChange = attributes => {
    this.setState({bulkAttributes: attributes});
  }

  handleBulkAttributeAddSubmit = () => {
    if (!this.state.bulkAttributes.length) {
      return;
    }

    // Use only the necessary data (id/value pair)
    const data = this.state.bulkAttributes.map(attribute => ({id: attribute.id, value: attribute.value}));

    this.props.bulkAddAttribute(data);
    this.props.closeBulkAttributeAddDialog();
    this.setState({bulkAttributes: []});
  }

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

  render() {
    const {classes, isBulkAttributeAddDialogOpen, closeBulkAttributeAddDialog} = this.props;

    return (
      <div className={classes.root}>
        <Dialog
          open={isBulkAttributeAddDialogOpen}
          onClose={closeBulkAttributeAddDialog}
          aria-labelledby="form-dialog-title"
          classes={{paperScrollPaper: classes.dialogPaper}}
        >
          <DialogTitle id="form-dialog-title">Ajouter un ou plusieurs attributs</DialogTitle>
          <DialogContent className={classes.dialogPaper}>
            <DialogContentText style={{marginBottom: 16}}>
              Cliquez sur le champ de texte ci-dessous, puis sélectionnez un ou plusieurs attributs. Définissez ensuite la valeur de chaque attribut.
              Appuyez ensuite sur <strong>Soumettre</strong> pour ajouter ces attributs aux produits sélectionnés.
            </DialogContentText>

            <AttributePicker
              availableAttributes={this.state.attributes}
              selectedAttributes={this.state.bulkAttributes}
              onChange={this.handleBulkAttributeChange}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={closeBulkAttributeAddDialog} color="primary">Annuler</Button>
            <Button onClick={this.handleBulkAttributeAddSubmit} color="primary">Soumettre</Button>
          </DialogActions>
        </Dialog>

        <PageHeader text="Trouver un produit"></PageHeader>

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
});

const mdtp = dispatch => ({
  performSearch: () => dispatch(performSearch()),
  bulkAddAttribute: attributes => dispatch(bulkAddAttributes(attributes)),
  closeBulkAttributeAddDialog: () => dispatch(closeBulkAttributeAddDialog()),
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(ProductSearchPage);
