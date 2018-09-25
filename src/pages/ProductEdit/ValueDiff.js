import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import red from "@material-ui/core/es/colors/red";
import green from "@material-ui/core/es/colors/green";
import Icon from "@material-ui/core/es/Icon/Icon";

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    padding: 4,
  },
  before: {
    padding: 4,
    borderRadius: 5,
    backgroundColor: red[100],
    textDecoration: 'line-through',
  },
  after: {
    padding: 4,
    borderRadius: 5,
    backgroundColor: green[100],
  },
  arrow: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  }
});

const ValueDiff = ({label, before, after, classes}) => (
  <div className={classes.root}>
    <span className={classes.label}>{label}:</span>
    <span className={classes.before}>{before}</span>
    <span className={classes.arrow}><Icon>arrow_right_alt</Icon></span>
    <span className={classes.after}>{after}</span>
  </div>
);

ValueDiff.propTypes = {
  label: PropTypes.string.isRequired,
  before: PropTypes.any.isRequired,
  after: PropTypes.any.isRequired,
}

export default withStyles(styles)(ValueDiff);
