import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import TableRow from "@material-ui/core/es/TableRow/TableRow";
import TableCell from "@material-ui/core/es/TableCell/TableCell";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import Button from "@material-ui/core/es/Button/Button";
import Icon from "@material-ui/core/es/Icon/Icon";
import Link from "react-router-dom/es/Link";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import MenuItem from "@material-ui/core/es/MenuItem/MenuItem";
import Menu from "@material-ui/core/es/Menu/Menu";
import connect from "react-redux/es/connect/connect";
import compose from "redux/src/compose";
import {cloneProduct, deleteProduct, selectProduct} from "./index";
import Checkbox from "@material-ui/core/es/Checkbox/Checkbox";
import ListItemIcon from "@material-ui/core/es/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import Hidden from "@material-ui/core/es/Hidden/Hidden";

const styles = theme => ({
  row: theme.table.rows.striped,
  recentlyUpdated: {
    position: 'absolute',
    top: 3,
    left: 3,
    fontSize: 10,
  },
  recentlyUpdatedContainer: {
    padding: theme.spacing.unit,
    wordBreak: 'break-all',
    position: 'relative',
  },
  cell: {
    padding: theme.spacing.unit,
    wordBreak: 'break-all'
  },
  cellDisabled: {
    padding: theme.spacing.unit,
    wordBreak: 'break-all',
    textDecoration: 'line-through'
  },
  button: {
    margin: theme.spacing.unit
  }
});

class SearchResult extends React.Component {
  state = {
    moreAnchor: null
  };

  handleMore = event => {
    this.setState({moreAnchor: event.currentTarget});
  }

  handleDelete = productId => {
    this.setState({moreAnchor: null});

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit?")) {
      return;
    }

    this.props.deleteProduct(productId)
  }

  handleClone = productId => {
    this.setState({moreAnchor: null});

    this.props.cloneProduct(productId)
  }

  handleClose = () => {
    this.setState({moreAnchor: null});
  }

  render() {
    const {classes, product, selectProduct, isSelected, isRecentlyUpdated} = this.props;
    const cellClass = product.isEnabled ? classes.cell : classes.cellDisabled;

    return (
      <TableRow className={classes.row}>
        <TableCell style={{textAlign: 'center', width: '50px'}} className={classes.recentlyUpdatedContainer}>
          {isRecentlyUpdated &&
          <Tooltip title="Récemment modifié"><Icon color="secondary" className={classes.recentlyUpdated}>edit</Icon></Tooltip>}
          <Checkbox
            checked={isSelected}
            onChange={() => selectProduct(this.props.productIndex)}
          />
        </TableCell>

        <Hidden smDown>
          <TableCell className={cellClass} style={{textAlign: 'center'}}>
            <div style={{width: '50px'}}>
              {!product.isCustom && <Tooltip title="Produit standard"><Icon>star_rate</Icon></Tooltip>}
              {product.metadata.isKit === "1" &&
              <Tooltip title="Ensemble de produits"><Icon>vertical_split</Icon></Tooltip>}
            </div>
          </TableCell>
        </Hidden>

        <Hidden only="xs">
          <TableCell className={cellClass} style={{minWidth: 80}}>{product.id}</TableCell>
        </Hidden>

        <Hidden only="xs">
          <TableCell className={cellClass}>
            {product.category.description.name}
            {
              product.department !== undefined &&
              <div>{product.department.description.name}</div>
            }
          </TableCell>
        </Hidden>

        <TableCell className={cellClass}>{product.sku}</TableCell>

        <Hidden smDown>
          <TableCell className={cellClass}>{product.description.name}</TableCell>
          <TableCell numeric={true} style={{minWidth: '130px'}} className={cellClass}>{product.price.toFixed(2)} $</TableCell>
        </Hidden>

        <TableCell style={{width: '200px'}}>
          <Tooltip title="Consulter">
            <Button mini variant="fab" color="primary" component={Link} to={'/products/' + product.id} className={classes.button}>
              <Icon>search</Icon>
            </Button>
          </Tooltip>

          <IconButton onClick={this.handleMore}>
            <Icon>more_horiz</Icon>
          </IconButton>

          <Menu
            id={'more-button-' + product.id}
            anchorEl={this.state.moreAnchor}
            open={Boolean(this.state.moreAnchor)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={() => this.handleClone(product.id)}>
              <ListItemIcon><Icon>control_point_duplicate</Icon></ListItemIcon>
              <ListItemText>Copier</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => this.handleDelete(product.id)}>
              <ListItemIcon><Icon>delete</Icon></ListItemIcon>
              <ListItemText>Supprimer</ListItemText>
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
    );
  }
}

SearchResult.propTypes = {
  product: PropTypes.object.isRequired,
  deleteProduct: PropTypes.func.isRequired
};

const mstp = state => ({});
const mdtp = dispatch => ({
  selectProduct: index => dispatch(selectProduct(index)),
  deleteProduct: productId => dispatch(deleteProduct(productId)),
  cloneProduct: productId => dispatch(cloneProduct(productId))
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(SearchResult);

