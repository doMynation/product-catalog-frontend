import React from 'react';
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/es/Typography/Typography";
import withStyles from "@material-ui/core/es/styles/withStyles";
import Icon from "@material-ui/core/es/Icon/Icon";

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    minHeight: 50,
    backgroundColor: theme.colors.layout.sectionHeader,
    padding: 10
  },
  icon: {
    color: "white",
    marginRight: 5
  },
  text: {
    color: "white",
    fontWeight: "bold",
  }
});

const SectionHeader = ({children, classes, text, icon = null}) => (
  <div className={classes.root}>
    {icon !== null && <Icon className={classes.icon}>{icon}</Icon>}

    <Typography variant="h6" className={classes.text}>
      {text}
    </Typography>
  </div>
);

SectionHeader.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string
};

export default withStyles(styles)(SectionHeader);
