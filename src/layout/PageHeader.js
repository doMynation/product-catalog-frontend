import React from 'react';
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/es/Typography/Typography";
import withStyles from "@material-ui/core/es/styles/withStyles";
import Icon from "@material-ui/core/es/Icon/Icon";

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: 100,
    minHeight: 100,
    padding: '2.4rem',
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
    <Typography variant="display1" className={classes.text}>
      {icon !== null && <Icon className={icon}>{icon}</Icon>}

      {text}
    </Typography>
  </div>
);

PageHeader.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string
};

export default withStyles(styles)(PageHeader);
