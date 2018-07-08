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

const styles = theme => ({
  root: {
    padding: 20
  },
  layout: {
    marginTop: 10
  }
});

class ProductSearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      products: [],
      productsCount: 0,
      categories: [],
      departments: [],
    };
  }

  componentDidMount() {
    const getCategories = () => ProductRepository.getProductCategories();
    const getDepartments = () => ProductRepository.getProductDepartments();

    Promise.all([getCategories(), getDepartments()]).then(data => {
      const [categories, departments] = data;

      this.setState({
        categories: categories,
        departments: departments,
      });
    });

    this.handleTableStateChange(this.props.searchState);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.searchState !== this.props.searchState) {
      this.handleTableStateChange(this.props.searchState);
    }
  }

  handleTableStateChange = state => {
    const offset = state.page * state.pageSize;
    var sortField = null;
    var sortDescending = null;

    if (state.sortField !== null) {
      sortField = state.sortField;
      sortDescending = state.sortOrder === "desc";
    }

    // Filters (exclude empty ones)
    let filters = {};
    for (let key in state.filters) {
      if (state.filters[key] !== "") {
        filters[key] = state.filters[key];
      }
    }

    this.setState({isLoading: true});

    ProductRepository.searchProducts(filters, sortField, sortDescending, offset, state.pageSize)
      .then(searchResult => {
        this.setState({
          isLoading: false,
          products: searchResult.results,
          productsCount: searchResult.totalCount,
        });
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
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={10} lg={10}>
            <Paper elevation={8}>
              <ProductSearchGrid
                isLoading={this.state.isLoading}
                data={this.state.products}
                rowsCount={this.state.productsCount}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mstp = ({productSearch}) => ({
  searchState: productSearch.search
});

export default compose(
  withStyles(styles),
  connect(mstp, null)
)(ProductSearchPage);
