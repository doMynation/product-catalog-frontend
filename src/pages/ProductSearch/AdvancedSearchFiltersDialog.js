import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/es/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/es/DialogActions/DialogActions";
import Button from "@material-ui/core/es/Button/Button";
import FormControlLabel from "@material-ui/core/es/FormControlLabel/FormControlLabel";
import Switch from "@material-ui/core/es/Switch/Switch";
import FormControl from "@material-ui/core/es/FormControl/FormControl";
import FormLabel from "@material-ui/core/es/FormLabel/FormLabel";
import FormGroup from "@material-ui/core/es/FormGroup/FormGroup";
import compose from "redux/src/compose";
import connect from "react-redux/es/connect/connect";
import {toggleAdvancedFilters} from "./actions";

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
  },
  formControl: {
    flexBasis: '40%',
    flexGrow: 1,
    minWidth: 220
  },
});

class AdvancedSearchFiltersDialog extends Component {
  state = {
    isCustom: "",
    isKit: "",
    isPart: "",
  };

  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (this.state[name] !== undefined && this.state[name] === value) {
      value = "";
    }

    this.setState((prevState, props) => {
      return {
        ...prevState,
        [name]: value
      };
    });
  }

  render() {
    const {classes} = this.props;
    const filters = this.state;

    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={this.props.isOpen}
      >
        <DialogTitle>Filtres avancés</DialogTitle>
        <DialogContent>
          <div className={classes.container}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">État du produit</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.isCustom !== undefined && filters.isCustom === "0"}
                      name="isCustom"
                      value="0"
                      color="secondary"
                      onChange={this.handleChange}
                    />
                  }
                  label="Standard"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.isCustom !== undefined && filters.isCustom === "1"}
                      name="isCustom"
                      value="1"
                      color="secondary"
                      onChange={this.handleChange}
                    />
                  }
                  label="Sur Mesure"
                />
              </FormGroup>
            </FormControl>

            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Type de produit</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.isKit !== undefined && filters.isKit === "1"}
                      name="isKit"
                      value="1"
                      color="primary"
                      onChange={this.handleChange}
                    />
                  }
                  label="Kit"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.isPart !== undefined && filters.isPart === "1"}
                      name="isPart"
                      value="1"
                      color="primary"
                      onChange={this.handleChange}
                    />
                  }
                  label="Pièce"
                />
              </FormGroup>
            </FormControl>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={this.props.handleCancelClick} color="primary">Annuler</Button>

          <Button onClick={() => this.props.onSubmit(this.state)} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AdvancedSearchFiltersDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
};

const mstp = state => ({
  isOpen: state.productSearch.isAdvancedSearchOpen
});

const mdtp = dispatch => ({
  handleCancelClick: () => dispatch(toggleAdvancedFilters(false))
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(AdvancedSearchFiltersDialog);

