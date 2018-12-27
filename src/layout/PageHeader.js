import React from 'react';
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/es/Typography/Typography";
import withStyles from "@material-ui/core/es/styles/withStyles";

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: 80,
    minHeight: 80,
    padding: theme.spacing.unit / 2
  },
  icon: {
    color: "white",
    fontSize: 25
  },
  text: {
    color: "white",
    fontWeight: "bold",
  }
});

const PageHeader = ({children, classes, text, icon = null}) => (
  <div className={classes.root}>
    <Typography variant="h4" className={classes.text}>
      {children}
    </Typography>
  </div>
);

PageHeader.propTypes = {
  children: PropTypes.any.isRequired
};

export default withStyles(styles)(PageHeader);
