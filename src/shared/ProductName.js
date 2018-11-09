import React from 'react';
import {compose} from 'redux';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Typography from "@material-ui/core/es/Typography/Typography";

const styles = theme => ({
  sku: {
    marginLeft: theme.spacing.unit / 2,
    display: 'inline'
  }
});

const ProductName = ({classes, sku, name}) => (
  <div>
    <div>
      <i className="fas fa-barcode fa-xs"></i>
      <Typography variant="caption" className={classes.sku}><strong>{sku}</strong></Typography>
    </div>

    <Typography variant="caption">{name}</Typography>
  </div>
);

ProductName.propTypes = {
  sku: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default compose(
  withStyles(styles),
)(ProductName);


