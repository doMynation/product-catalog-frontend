import React from 'react';
import PropTypes from 'prop-types';
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/es/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/es/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/es/DialogActions/DialogActions";
import Button from "@material-ui/core/es/Button/Button";
import AttributePicker from "../../shared/AttributePicker/AttributePicker";

class BulkAttributeAddDialog extends React.PureComponent {
  render() {
    const {isOpen, onClose, onSubmit, onChange, availableAttributes, selectedAttributes} = this.props;

    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="Ajouter des attributs aux produits sélectionnés"
      >
        <DialogTitle id="form-dialog-title">Ajouter un ou plusieurs attributs</DialogTitle>
        <DialogContent>
          <DialogContentText style={{marginBottom: 16}}>
            Cliquez sur le champ de texte ci-dessous, puis sélectionnez un ou plusieurs attributs. Définissez ensuite la valeur de chaque attribut.
            Finalement, appuyez sur <strong>Soumettre</strong> pour ajouter ces attributs aux produits sélectionnés.
          </DialogContentText>

          <AttributePicker
            availableAttributes={availableAttributes}
            selectedAttributes={selectedAttributes}
            onChange={onChange}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="primary">Annuler</Button>
          <Button onClick={onSubmit} color="primary">Soumettre</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

BulkAttributeAddDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  availableAttributes: PropTypes.array.isRequired,
  selectedAttributes: PropTypes.array.isRequired,
};

export default BulkAttributeAddDialog;

