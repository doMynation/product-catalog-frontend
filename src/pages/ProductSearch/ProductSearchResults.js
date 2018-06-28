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

const styles = theme => ({});

class ProductSearchResults extends React.PureComponent {
  render() {
    const products = this.props.products;

    return (
      <React.Fragment>
        {products.map((product, idx) =>
          <TableRow key={'row_' + idx} className={this.props.classes.row}>
            <TableCell style={{textAlign: 'center'}}>
              {
                product.isCustom ?
                  <Tooltip title="Sur mesure"><Icon>colorize</Icon></Tooltip> :
                  <Tooltip title="Standard"><Icon>star</Icon></Tooltip>
              }

              {product.id}
            </TableCell>
            <TableCell>
              {product.category.description.name}
              {product.department === undefined ? '' : `/ ${product.department.description.name}`}
            </TableCell>
            <TableCell>{product.sku}</TableCell>
            <TableCell>{product.description.name}</TableCell>
            <TableCell numeric={true}>{product.price.toFixed(2)} $</TableCell>
            <TableCell>
              <Tooltip title="Consulter">
                <Button mini variant="fab" color="primary" component={Link} to={'/products/' + product.id}>
                  <Icon>search</Icon>
                </Button>
              </Tooltip>

              <Tooltip title="Dupliquer">
                <IconButton>
                  <Icon>add</Icon>
                </IconButton>
              </Tooltip>

              <Tooltip title="Supprimer">
                <IconButton>
                  <Icon>delete</Icon>
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  }
}

ProductSearchResults.propTypes = {
  products: PropTypes.array.isRequired
};

export default withStyles(styles)(ProductSearchResults);
