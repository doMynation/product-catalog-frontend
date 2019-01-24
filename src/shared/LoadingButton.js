import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Button from "@material-ui/core/es/Button/Button";
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";

const styles = theme => ({
  loadingButton: {...theme.buttonProgress}
});

const LoadingButton = ({classes, isLoading, children, disabled, ...rest}) => (
  <Button {...rest} disabled={isLoading || disabled}>
    {children}
    {isLoading && <CircularProgress className={classes.loadingButton} size={20}/>}
  </Button>
);

LoadingButton.propTypes = {
  isLoading: PropTypes.bool,
  children: PropTypes.node,
};

export default withStyles(styles)(LoadingButton);


