import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import red from "@material-ui/core/es/colors/red";
import green from "@material-ui/core/es/colors/green";
import Icon from "@material-ui/core/es/Icon/Icon";
import Typography from "@material-ui/core/es/Typography/Typography";

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    padding: 4,
    fontWeight: 'bold'
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
    <Typography variant="caption"><span className={classes.label}>{label}:</span></Typography>
    {before !== undefined &&
    <Typography variant="caption"><span className={classes.before}>{before}</span></Typography>}
    {before !== undefined && after !== undefined &&
    <Typography variant="caption"><span className={classes.arrow}><Icon>arrow_right_alt</Icon></span></Typography>}
    {after !== undefined &&
    <Typography variant="caption"><span className={classes.after}>{after}</span></Typography>}
  </div>
);

ValueDiff.propTypes = {
  label: PropTypes.string.isRequired,
  before: PropTypes.string,
  after: PropTypes.string,
}

export default withStyles(styles)(ValueDiff);
