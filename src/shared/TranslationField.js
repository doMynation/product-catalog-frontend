import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import FormControl from "@material-ui/core/es/FormControl/FormControl";
import TextField from "@material-ui/core/es/TextField/TextField";
import FormHelperText from "@material-ui/core/es/FormHelperText/FormHelperText";
import Icon from "@material-ui/core/es/Icon/Icon";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import Card from "@material-ui/core/es/Card/Card";
import CardHeader from "@material-ui/core/es/CardHeader/CardHeader";
import CardContent from "@material-ui/core/es/CardContent/CardContent";

const styles = theme => ({});

class TranslationField extends React.PureComponent {
  handleChange = (e, fieldName) => {
    const updated = {
      ...this.props.translation,
      [fieldName]: e.target.value
    };

    this.props.onChange(updated);
  }

  renderControls = () => (
    <React.Fragment>
      <Tooltip title="Assigner comme langue primaire">
        <IconButton onClick={this.props.onMakeDefault}><Icon>star_border</Icon></IconButton>
      </Tooltip>
      <Tooltip title="Supprimer">
        <IconButton onClick={this.props.onDelete}><Icon>delete</Icon></IconButton>
      </Tooltip>
    </React.Fragment>
  )

  render() {
    const {languageName, translation} = this.props;

    return (
      <Card>
        <CardHeader
          action={!translation.isDefault ? this.renderControls() : null}
          title={languageName}
          subheader={translation.isDefault ? "Langue par défaut" : ""}
        />
        <CardContent>
          <FormControl fullWidth>
            <TextField
              label="Nom"
              value={translation.name}
              onChange={e => this.handleChange(e, "name")}
              error={translation.name.trim() === ""}
            />
            {translation.name.trim() === "" && <FormHelperText error>Obligatoire</FormHelperText>}
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Description (Courte)"
              value={translation.shortDescription}
              onChange={e => this.handleChange(e, "shortDescription")}
              multiline
              rowsMax="4"
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Description (Longue)"
              value={translation.longDescription}
              onChange={e => this.handleChange(e, "longDescription")}
              multiline
              rowsMax="4"
            />
          </FormControl>
        </CardContent>
      </Card>
    );
  }
}

TranslationField.propTypes = {
  translation: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMakeDefault: PropTypes.func.isRequired,
};

export default withStyles(styles)(TranslationField);
