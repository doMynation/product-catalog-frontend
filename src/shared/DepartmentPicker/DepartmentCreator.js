import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import TextField from "@material-ui/core/es/TextField/TextField";
import Typography from "@material-ui/core/es/Typography/Typography";
import Icon from "@material-ui/core/es/Icon/Icon";
import LoadingButton from "../LoadingButton";
import ProductRepository from "../../util/ProductRepository";

const styles = theme => ({});

const i18n = {
  name: "Nom",
  code: "Code",
  buttonLabel: "Créer",
};

class DepartmentCreator extends Component {
  state = {
    name: "",
    code: "",
    isLoading: false
  };

  handleNameChange = e => {
    this.setState({name: e.target.value});
  }

  handleCodeChange = e => {
    this.setState({code: e.target.value});
  }

  handleSubmit = () => {
    this.setState({isLoading: true});

    ProductRepository
      .createDepartment(this.state.code.trim(), this.state.name.trim())
      .then(dept => this.props.onSubmit(dept))
      .catch(err => console.log('ERROR', err));
  }

  render() {
    const {name, code, isLoading} = this.state;
    const isFormComplete = name.trim() !== "" && code.trim() !== "";

    return (
      <div>
        <Typography>Veuillez remplir les champs suivants:</Typography>

        <TextField
          label={i18n.name}
          value={name}
          onChange={this.handleNameChange}
          fullWidth
          required
        />

        <TextField
          label={i18n.code}
          value={code}
          onChange={this.handleCodeChange}
          fullWidth
          required
        />

        <LoadingButton onClick={this.handleSubmit} color="primary" disabled={isLoading || !isFormComplete} isLoading={isLoading}>
          {i18n.buttonLabel}
          <Icon>add</Icon>
        </LoadingButton>
      </div>
    );
  }
}

DepartmentCreator.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(DepartmentCreator);
