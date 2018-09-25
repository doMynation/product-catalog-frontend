import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Paper from "@material-ui/core/es/Paper/Paper";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit
  }
});

const Section = ({classes, children, elevation = null}) => (
  <Paper elevation={elevation === null ? 2 : elevation} className={classes.root}>{children}</Paper>
);

Section.propTypes = {
  elevation: PropTypes.number
};

export default withStyles(styles)(Section);
