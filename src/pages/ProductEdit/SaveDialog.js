import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Window from "../../shared/Window";
import UpdateDiff from "./UpdateDiff";
import compose from "redux/src/compose";
import connect from "react-redux/es/connect/connect";
import {closeSaveDialog, saveProduct} from "./index";

const styles = theme => ({});

class SaveDialog extends Component {
  render() {
    const {isOpen, onClose, onSubmit} = this.props;

    return (
      <Window
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        title="Confirmer les changements"
        description="Voici les changements qui seront appliqués au produit. Appuyez sur Soumettre (TODO BOLD) pour sauvegarder."
      >
        <UpdateDiff/>
      </Window>
    );
  }
}

SaveDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const mstp = state => ({
  isOpen: state.productEdit.isSaveDialogOpen,
});

const mdtp = dispatch => ({
  onClose: () => dispatch(closeSaveDialog()),
  onSubmit: () => dispatch(saveProduct()),
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(SaveDialog);
