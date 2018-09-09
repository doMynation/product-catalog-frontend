import React from 'react';
import PropTypes from 'prop-types'
import withStyles from "@material-ui/core/es/styles/withStyles";
import TableHead from "@material-ui/core/es/TableHead/TableHead";
import Table from "@material-ui/core/es/Table/Table";
import TableRow from "@material-ui/core/es/TableRow/TableRow";
import TableCell from "@material-ui/core/es/TableCell/TableCell";
import TableSortLabel from "@material-ui/core/es/TableSortLabel/TableSortLabel";
import TableBody from "@material-ui/core/es/TableBody/TableBody";
import TablePagination from "@material-ui/core/es/TablePagination/TablePagination";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import Icon from "@material-ui/core/es/Icon/Icon";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Grid from "@material-ui/core/es/Grid/Grid";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import SearchResult from "./SearchResult";
import connect from "react-redux/es/connect/connect";
import compose from "redux/src/compose";
import {
  changePage,
  changePageSize,
  cloneProduct,
  disableProduct,
  enableProduct,
  resetSearch,
  selectAll, selectProduct,
  sortBy
} from "./index";
import Checkbox from "@material-ui/core/es/Checkbox/Checkbox";
import Hidden from "@material-ui/core/es/Hidden/Hidden";

const styles = theme => ({
  row: theme.table.rows.striped,
  cell: {
    padding: theme.spacing.unit
  },
  resetButton: {
    paddingLeft: theme.spacing.unit
  }
});

class SearchGrid extends React.PureComponent {
  render() {
    const {data, isLoading, selected, recentlyUpdated, selectProduct, enableProduct, disableProduct, cloneProduct} = this.props;

    return (
      <React.Fragment>
        {isLoading ? <LinearProgress/> : ''}

        <Table>
          {this.renderHead()}
          <TableBody>
            {data.map((product, idx) => {
              const isSelected = selected.indexOf(idx) !== -1;
              const isRecentlyUpdated = recentlyUpdated.indexOf(product.id) !== -1;

              return (
                <SearchResult
                  isSelected={isSelected}
                  isRecentlyUpdated={isRecentlyUpdated}
                  product={product}
                  productIndex={idx}
                  key={'product_' + idx}
                  onSelect={selectProduct}
                  onClone={cloneProduct}
                  onEnable={enableProduct}
                  onDisable={disableProduct}
                />
              );
            })}
          </TableBody>
        </Table>
        {this.renderFooter()}
      </React.Fragment>
    );
  }

  renderHead = () => {
    const {classes, sortBy, sortField, sortOrder, selectAll, selected} = this.props;
    const isAllSelected = this.props.data.length === selected.length;

    return (
      <TableHead>
        <TableRow>
          <TableCell className={classes.cell}>
            <Checkbox
              checked={isAllSelected}
              onChange={() => selectAll()}
            />
          </TableCell>

          <Hidden smDown>
            <TableCell className={classes.cell}>{' '}</TableCell>
          </Hidden>

          <Hidden only="xs">
            <TableCell className={classes.cell}>
              <TableSortLabel active={sortField === "id"} direction={sortOrder} onClick={() => sortBy('id')}>ID</TableSortLabel>
            </TableCell>
          </Hidden>

          <Hidden only="xs">
            <TableCell className={classes.cell}>
              <TableSortLabel active={sortField === "category"} direction={sortOrder} onClick={() => sortBy('category')}>
                Catégorie/<br/>Département
              </TableSortLabel>
            </TableCell>
          </Hidden>

          <TableCell className={classes.cell}>
            <TableSortLabel active={sortField === "sku"} direction={sortOrder} onClick={() => sortBy('sku')}>SKU</TableSortLabel>
          </TableCell>

          <Hidden smDown>
            <TableCell className={classes.cell}>
              <TableSortLabel active={sortField === "name"} direction={sortOrder} onClick={() => sortBy('name')}>Nom</TableSortLabel>
            </TableCell>
            <TableCell className={classes.cell}>
              <TableSortLabel active={sortField === "price"} direction={sortOrder} onClick={() => sortBy('price')}>Prix</TableSortLabel>
            </TableCell>
          </Hidden>

          <TableCell className={classes.cell}>{' '}</TableCell>
        </TableRow>
      </TableHead>
    );
  }

  renderFooter = () => {
    const {classes, rowsCount, page, pageSize, resetSearch, changePage, changePageSize} = this.props;

    return (
      <Grid container>
        <Grid item xs={2} className={classes.resetButton}>
          <Tooltip title="Réinitialiser" placement="right">
            <IconButton onClick={resetSearch}>
              <Icon>settings_backup_restore</Icon>
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item xs={10}>
          <TablePagination
            component="div"
            count={rowsCount}
            page={page}
            rowsPerPage={pageSize}
            onChangePage={(e, page) => changePage(page)}
            onChangeRowsPerPage={(e) => changePageSize(e.target.value)}
          />
        </Grid>
      </Grid>
    );
  }
}

SearchGrid.propTypes = {
  data: PropTypes.array.isRequired,
  rowsCount: PropTypes.number.isRequired
};

const mstp = state => ({productSearch}) => {
  const search = productSearch.search;

  return {
    selected: productSearch.selected,
    recentlyUpdated: productSearch.recentlyUpdated,
    sortField: search.sortField,
    sortOrder: search.sortOrder,
    page: search.page,
    pageSize: search.pageSize,
  };
};

const mdtp = dispatch => ({
  resetSearch: () => dispatch(resetSearch()),
  sortBy: field => dispatch(sortBy(field)),
  changePage: pageNumber => dispatch(changePage(pageNumber)),
  changePageSize: size => dispatch(changePageSize(size)),
  selectAll: () => dispatch(selectAll()),
  selectProduct: index => dispatch(selectProduct(index)),
  enableProduct: productId => dispatch(enableProduct(productId)),
  disableProduct: productId => dispatch(disableProduct(productId)),
  cloneProduct: productId => dispatch(cloneProduct(productId))
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(SearchGrid);
