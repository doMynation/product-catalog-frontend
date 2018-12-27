import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/es/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/es/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/es/DialogActions/DialogActions";
import Button from "@material-ui/core/es/Button/Button";
import {compose} from "redux";
import {connect} from "react-redux";
import {acknowledgeSessionExpired} from "./index";

const styles = theme => ({});

const i18n = {
  ok: "Ok",
  title: "Uh oh!",
  description: "Pour des raisons de sécurité, votre session a été terminée par faute d'inactivité prolongée.",
};

class UnauthorizedDialog extends React.Component {
  render() {
    const {isOpen, accept} = this.props;

    return (
      <Dialog
        open={isOpen}
        aria-labelledby={i18n.title}
      >
        <DialogTitle id="form-dialog-title">{i18n.title}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{marginBottom: 16}}>{i18n.description}</DialogContentText>
          hi
        </DialogContent>

        <DialogActions>
          <Button onClick={accept} color="primary">
            {i18n.ok}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

UnauthorizedDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

const mstp = ({shared}) => ({
  isOpen: shared.isSessionExpired
});

const mdtp = dispatch => ({
  accept: () => dispatch(acknowledgeSessionExpired())
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp),
)(UnauthorizedDialog);

