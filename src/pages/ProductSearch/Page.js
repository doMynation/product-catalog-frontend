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
import {closeBulkAttributeAddDialog, performSearch} from "./index";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/es/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/es/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/es/DialogActions/DialogActions";
import Button from "@material-ui/core/es/Button/Button";
import AttributePicker from "../../shared/AttributePicker";

// @todo: Fetch this from the API
const availableAttributes = [
  {
    value: 18,
    dataType: "dimension",
    inputType: "textfield",
    code: "height",
    label: "Hauteur",
    params: ['thing1', 'thing2']
  },
  {value: 10, dataType: "dimension", inputType: "textfield", code: "length", label: "Longueur", params: []},
  {
    value: 10,
    dataType: "string",
    inputType: "select",
    code: "color",
    label: "Couleur",
    values: [
      {id: 2343, name: 'Bleu'},
      {id: 2345, name: 'Blanc'},
      {id: 2348, name: 'Rouge'},
    ]
  },
  {value: 10, dataType: "angle", inputType: "textfield", code: "cutAngle", label: "Angle de coupe", params: []},
  {value: 10, dataType: "boolean", inputType: "yesno", code: "isFragile", label: "Est fragile", params: []},
];

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
    isLoading: false,
    categories: [],
    departments: [],
    stores: []
  };

  handleSubmit = attributes => {
    console.log(attributes);
  }

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
              availableAttributes={availableAttributes}
              onChange={this.handleSubmit}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={closeBulkAttributeAddDialog} color="primary">Annuler</Button>
            <Button onClick={this.handleDialogSubmit} color="primary">Soumettre</Button>
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
  closeBulkAttributeAddDialog: () => dispatch(closeBulkAttributeAddDialog()),
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(ProductSearchPage);
