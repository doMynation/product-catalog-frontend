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
import InputAdornment from "@material-ui/core/es/InputAdornment/InputAdornment";

/**
 *
 DATA TYPES todo
 --------------
 date
 datetime

 INPUT TYPES todo
 --------------
 textarea
 date
 yesno

 */

const styles = theme => ({
  radioGroup: {
    flexDirection: 'row'
  },
  formControl: {
    minWidth: 250
  }
});

class AttributeInput extends React.Component {
  inputId = `input_${this.props.attribute.code}`;

  handleChange = e => {
    this.props.onChange(e.target.value);
  }

  renderTextField(attribute, value) {
    const {classes} = this.props;
    let props = {};

    if (["angle", "int", "money"].includes(attribute.dataType)) {
      props.type = "number";
      props.onFocus = e => e.target.select();
    }

    if (attribute.dataType === "angle") {
      props.InputProps = {
        startAdornment: <InputAdornment position="start">°</InputAdornment>,
      };
    } else if (attribute.dataType === "money") {
      props.InputProps = {
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      };
    }

    return (
      <FormControl className={classes.formControl}>
        <TextField id={this.inputId} label={attribute.description.name} value={value} onChange={this.handleChange} {...props}/>
      </FormControl>
    );
  }

  renderDimensionField(attribute, value) {
    const {classes} = this.props;

    return (
      <FormControl className={classes.formControl}>
        <TextField
          id={this.inputId}
          label={attribute.description.name}
          value={value}
          onChange={this.handleChange}
          onFocus={e => e.target.select()}
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">Po</InputAdornment>,
          }}
        />
      </FormControl>
    );
  }

  renderBooleanField(attribute, value) {
    const {classes} = this.props;

    return (
      <FormControl className={classes.formControl}>
        <FormLabel>{attribute.description.name}</FormLabel>
      </FormControl>
    )
  }

  renderYesNo(attribute, value) {
    const {classes} = this.props;

    return (
      <FormControl className={classes.formControl}>
        <FormLabel component="div">{attribute.description.name}</FormLabel>
        <RadioGroup
          aria-label={attribute.description.name}
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
        <InputLabel htmlFor={this.inputId}>{attribute.description.name}</InputLabel>
        <Select
          value={value}
          onChange={this.handleChange}
          inputProps={{
            name: this.inputId,
            id: this.inputId
          }}>
          >
          {attribute.values.map((value, idx) => (
            <MenuItem key={idx} value={value.id}>{value.description.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  render() {
    const {attribute, value} = this.props;

    if (attribute.dataType === "boolean") {
      return this.renderBooleanField(attribute, value);
    }

    switch (attribute.inputType) {
      case "textfield":
        if (attribute.dataType === "dimension") {
          return this.renderDimensionField(attribute, value);
        }

        return this.renderTextField(attribute, value);
      case "yesno":
        return this.renderYesNo(attribute, value);
      case "select":
        return this.renderSelect(attribute, value);
      default:
        return this.renderTextField(attribute, value);
    }
  }
}

AttributeInput.propTypes = {
  attribute: PropTypes.object.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(AttributeInput);
