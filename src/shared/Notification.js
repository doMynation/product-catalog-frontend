import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Snackbar from "@material-ui/core/es/Snackbar/Snackbar";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Icon from "@material-ui/core/es/Icon/Icon";
import connect from "react-redux/es/connect/connect";
import compose from "redux/src/compose";
import {closeNotification} from "./index";

const styles = theme => ({});

class Notification extends React.PureComponent {
  handleClose = (event, reason) => {
    // Avoid closing the snackbar when clicking away
    if (reason === "clickaway") {
      return;
    }

    this.props.hide();
  }

  render() {
    const {isOpen, message, positionX, positionY, duration} = this.props;

    return (
      <Snackbar
        anchorOrigin={{
          vertical: positionY,
          horizontal: positionX
        }}
        open={isOpen}
        autoHideDuration={duration}
        onClose={this.handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleClose}
          >
            <Icon>close</Icon>
          </IconButton>,
        ]}
      />
    );
  }
}

Notification.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  positionX: PropTypes.oneOf(['center', 'left', 'right']),
  positionY: PropTypes.oneOf(['top', 'bottom']),
  duration: PropTypes.number.isRequired
};

const mstp = ({shared}) => ({
  isOpen: shared.notification.isOpen,
  message: shared.notification.message,
  positionX: shared.notification.positionX,
  positionY: shared.notification.positionY,
  duration: shared.notification.duration,
});

const mdtp = dispatch => ({
  hide: () => dispatch(closeNotification())
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(Notification);
