import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import FormControl from "@material-ui/core/es/FormControl/FormControl";
import TextField from "@material-ui/core/es/TextField/TextField";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Icon from "@material-ui/core/es/Icon/Icon";

const styles = theme => ({
  root: {
    display: 'flex',
  }
});

class SaveTemplateButton extends Component {
  state = {
    isDirty: true,
    templateName: ""
  };

  handleSubmit = () => {
    const templateName = this.state.templateName.trim();

    if (templateName === "") {
      return;
    }

    this.setState({templateName: "", isDirty: true}, () => {
      this.props.onSubmit(templateName);
    });
  }

  handleChange = e => {
    this.setState({isDirty: false, templateName: e.target.value});
  }

  render() {
    const {classes} = this.props;
    const {isDirty, templateName} = this.state;
    const isError = !isDirty && templateName === "";

    return (
      <div className={classes.root}>
        <FormControl>
          <TextField
            fullWidth={true}
            style={{minWidth: 200}}
            error={isError}
            helperText={isError ? "Ne peut être vide" : ""}
            placeholder="Sauvegardez cette liste ..."
            value={templateName}
            onChange={this.handleChange}
          />
        </FormControl>

        {!isError && templateName !== "" &&
        <Tooltip title="Sauvegarder" placement="top">
          <IconButton aria-label="Sauvegarder" onClick={this.handleSubmit}>
            <Icon>save</Icon>
          </IconButton>
        </Tooltip>
        }
      </div>
    );
  }
}

SaveTemplateButton.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default withStyles(styles)(SaveTemplateButton);
