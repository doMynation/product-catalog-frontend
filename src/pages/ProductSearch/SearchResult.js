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

const styles = theme => ({
  row: theme.table.rows.striped,
  button: {
    margin: theme.spacing.unit
  }
});

class SearchResult extends React.PureComponent {
  render() {
    const {classes, product} = this.props;

    return (
      <TableRow className={classes.row}>
        <TableCell style={{textAlign: 'center'}}>
          {
            product.isCustom &&
            <div><Tooltip title="Sur mesure"><Icon>star</Icon></Tooltip></div>
          }

          {product.id}
        </TableCell>
        <TableCell>
          {product.category.description.name}
          {
            product.department !== undefined &&
            <div>{product.department.description.name}</div>
          }
        </TableCell>
        <TableCell>{product.sku}</TableCell>
        <TableCell>{product.description.name}</TableCell>
        <TableCell numeric={true} style={{minWidth: '130px'}}>{product.price.toFixed(2)} $</TableCell>
        <TableCell style={{width: '200px'}}>
          <Tooltip title="Consulter">
            <Button mini variant="fab" color="primary" component={Link} to={'/products/' + product.id} className={classes.button}>
              <Icon>search</Icon>
            </Button>
          </Tooltip>

          <Tooltip title="Plus ...">
            <IconButton>
              <Icon>more_horiz</Icon>
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  }
}

SearchResult.propTypes = {
  product: PropTypes.object.isRequired
};

export default withStyles(styles)(SearchResult);
