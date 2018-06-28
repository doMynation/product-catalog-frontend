import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Paper from "@material-ui/core/es/Paper/Paper";

const styles = theme => ({
  root: {
    padding: '2.4rem',
    backgroundColor: "white"
  }
});

const PageContent = ({children, classes}) => (
  <Paper className={classes.root} elevation={8}>
    {children}
  </Paper>
);

PageContent.propTypes = {
  children: PropTypes.any.isRequired,
};

export default withStyles(styles)(PageContent);

