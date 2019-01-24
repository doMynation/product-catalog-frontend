import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Typography from "@material-ui/core/es/Typography/Typography";
import Icon from "@material-ui/core/es/Icon/Icon";

const styles = theme => ({
  root: {
    textAlign: 'left',
    padding: theme.spacing.unit,
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    display: 'flex',
  },
  text: {
    marginLeft: theme.spacing.unit,
  },
  title: {
    fontWeight: 800,
  },
  description: {
    marginTop: theme.spacing.unit / 2,
  },
});

const getCss = type => {
  switch (type) {
    case 'error':
      return {
        icon: {
          color: '#dc4c4cf2',
        },
        container: {
          borderLeftColor: '#dc4c4cf2',
          backgroundColor: '#b137324d',
        },
        iconName: 'error_outline',
      };
    case 'success':
      return {
        icon: {
          color: '#22750eab',
        },
        container: {
          borderLeftColor: '#22750eab',
          backgroundColor: '#4bb1324d',
        },
        iconName: 'check_circle_outline',
      };
    case 'info':
      return {
        icon: {
          color: '#1227b9bf',
        },
        container: {
          borderLeftColor: '#1227b9bf',
          backgroundColor: '#3176b14d',
        },
        iconName: 'check_circle_outline',
      };
    default:
      return {
        icon: {
          color: 'grey',
        },
        container: {
          borderLeftColor: 'darkgrey',
          backgroundColor: 'grey',
        },
        iconName: 'check_circle_outline',
      };
  }
};

const Alert = ({classes, title, description, type}) => {
  const css = getCss(type);

  return (
    <div className={classes.root} style={css.container}>
      <Icon style={css.icon}>{css.iconName}</Icon>
      <div className={classes.text}>
        <Typography className={classes.title}>{title}</Typography>
        <Typography className={classes.description}>{description}</Typography>
      </div>
    </div>
  );
};

Alert.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["error", "success", "info"]).isRequired,
};

export default withStyles(styles)(Alert);
