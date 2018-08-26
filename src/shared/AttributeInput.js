import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import FormControlLabel from "@material-ui/core/es/FormControlLabel/FormControlLabel";
import Radio from "@material-ui/core/es/Radio/Radio";
import RadioGroup from "@material-ui/core/es/RadioGroup/RadioGroup";
import InputLabel from "@material-ui/core/es/InputLabel/InputLabel";
import FormControl from "@material-ui/core/es/FormControl/FormControl";
import Select from "@material-ui/core/es/Select/Select";
import MenuItem from "@material-ui/core/es/MenuItem/MenuItem";
import FormLabel from "@material-ui/core/es/FormLabel/FormLabel";
import TextField from "@material-ui/core/es/TextField/TextField";

const styles = theme => ({
  radioGroup: {
    flexDirection: 'row'
  },
  formControl: {
    minWidth: 120
  }
});

class AttributeInput extends React.Component {
  state = {
    value: ""
  };

  inputId = `input_${this.props.attribute.code}`;

  handleChange = e => {
    // this.setState({value: e.target.value});

    this.props.onChange(e.target.value);
  }

  renderTextField(attribute, value) {
    return (
      <FormControl>
        <TextField id={this.inputId} label={attribute.label} placeholder="Valeur ..." value={value} onChange={this.handleChange}/>
      </FormControl>
    );
  }

  renderYesNo(attribute, value) {
    const {classes} = this.props;

    return (
      <FormControl>
        <FormLabel component="div">{attribute.label}</FormLabel>
        <RadioGroup
          aria-label={attribute.label}
          name={this.inputId}
          value={value}
          onChange={this.handleChange}
          className={classes.radioGroup}
        >
          <FormControlLabel
            value="yes"
            control={<Radio color="primary"/>}
            label="Oui"
          />
          <FormControlLabel
            value="no"
            control={<Radio color="secondary"/>}
            label="Non"
          />
        </RadioGroup>
      </FormControl>
    )
  }

  renderSelect(attribute, value) {
    const {classes} = this.props;

    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor={this.inputId}>{attribute.label}</InputLabel>
        <Select
          value={value}
          onChange={this.handleChange}
          inputProps={{
            name: this.inputId,
            id: this.inputId
          }}>
          >
          {attribute.values.map((value, idx) => (
            <MenuItem key={idx} value={value.id}>{value.name}</MenuItem>
          ))}
        </Select>

      </FormControl>
    );
  }

  render() {
    const {attribute, value} = this.props;

    return (
      <div>
        {attribute.inputType === 'textfield' && this.renderTextField(attribute, value)}
        {attribute.inputType === 'yesno' && this.renderYesNo(attribute, value)}
        {attribute.inputType === 'select' && this.renderSelect(attribute, value)}
      </div>
    );
  }
}

AttributeInput.propTypes = {
  attribute: PropTypes.object.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(AttributeInput);
