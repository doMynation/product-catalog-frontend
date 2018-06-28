import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import MenuItem from "@material-ui/core/es/MenuItem/MenuItem";
import Select from "@material-ui/core/es/Select/Select";
import InputLabel from "@material-ui/core/es/InputLabel/InputLabel";
import FormControl from "@material-ui/core/es/FormControl/FormControl";
import FormHelperText from "@material-ui/core/es/FormHelperText/FormHelperText";

const styles = theme => ({});

class CategoriesDropdown extends React.PureComponent {
  render() {
    const {categories, value, onChange, label = "", helpText = "", id = "", name = "", ...others} = this.props;

    return (
      <React.Fragment>
        <FormControl>
          <InputLabel htmlFor={id}>{label}</InputLabel>
          <Select
            style={{width: 120}}
            value={value}
            onChange={onChange}
            inputProps={{
              id: id,
              name: name,
            }}
            {...others}
          >
            <MenuItem value="">
              <em>Toutes</em>
            </MenuItem>
            {categories.map((category, idx) => (
              <MenuItem key={idx} value={category.code}>{'\u00A0\u00A0'.repeat(category.depth - 1)}{category.description.name}</MenuItem>
            ))}
          </Select>
          {helpText !== "" && <FormHelperText>{helpText}</FormHelperText>}
        </FormControl>
      </React.Fragment>
    );
  }
}

CategoriesDropdown.propTypes = {
  categories: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired
};

export default withStyles(styles)(CategoriesDropdown);
