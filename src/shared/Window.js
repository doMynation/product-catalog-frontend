import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/es/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/es/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/es/DialogActions/DialogActions";
import Button from "@material-ui/core/es/Button/Button";

const styles = theme => ({});

const Window = ({isOpen, onClose, onSubmit, title, description, children}) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
    aria-labelledby="Confirmer les changements"
  >
    <DialogTitle id="form-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText style={{marginBottom: 16}}>{description}</DialogContentText>
      {children}
    </DialogContent>

    <DialogActions>
      <Button onClick={onClose} color="primary">Annuler</Button>
      <Button onClick={onSubmit} color="primary">Soumettre</Button>
    </DialogActions>
  </Dialog>
);

Window.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(Window);
