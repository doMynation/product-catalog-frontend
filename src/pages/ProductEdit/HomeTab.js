import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import compose from "redux/src/compose";
import TextField from "@material-ui/core/es/TextField/TextField";
import FormHelperText from "@material-ui/core/es/FormHelperText/FormHelperText";
import FormControl from "@material-ui/core/es/FormControl/FormControl";
import {updateField} from "./index";
import connect from "react-redux/es/connect/connect";
import CategoriesDropdown from "../../shared/CategoriesDropdown";
import ReactTags from 'react-tag-autocomplete'
import 'react-tag-autocomplete/example/styles.css'
import InputLabel from "@material-ui/core/es/InputLabel/InputLabel";
import Select from "@material-ui/core/es/Select/Select";
import MenuItem from "@material-ui/core/es/MenuItem/MenuItem";
import InputAdornment from "@material-ui/core/es/InputAdornment/InputAdornment";
import FormControlLabel from "@material-ui/core/es/FormControlLabel/FormControlLabel";
import Switch from "@material-ui/core/es/Switch/Switch";

const styles = theme => ({
  switches: {
    flexDirection: 'row'
  },
  colorSwitchBase: {
    '&$colorChecked': {
      color: theme.colors.success,
      '& + $colorBar': {
        backgroundColor: theme.colors.success,
      },
    },
  },
  colorBar: {},
  colorChecked: {},
});

const tagSuggestion = ["model", "kmo"].map(name => ({name: name}));

class HomeTab extends Component {
  handleAddTag = ({name}) => {
    const tags = this.props.fields.tags.value.concat([name]);

    this.props.updateField("tags", tags);
  }

  handleDeleteTag = idx => {
    const tags = [...this.props.fields.tags.value];
    tags.splice(idx, 1);

    this.props.updateField("tags", tags);
  }

  handleChange = e => {
    const {name, value} = e.target;

    this.props.updateField(name, value);
  }

  handleSwitchChange = e => {
    const {name} = e.target;

    if (this.props.fields[name].value)
      this.props.updateField(name, false);
    else
      this.props.updateField(name, true);
  }

  render() {
    const {fields, classes, updateField, categories, departments} = this.props;
    const tags = fields.tags.value.map(tag => ({name: tag}));

    return (
      <div>
        <FormControl fullWidth>
          <TextField
            fullWidth
            error={fields.sku.error !== ""}
            label="SKU"
            id="sku"
            name="sku"
            onChange={this.handleChange}
            value={fields.sku.value}
          />
          {fields.sku.error && <FormHelperText error>{fields.sku.error}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth>
          <TextField
            error={fields.mpn.error !== ""}
            label="MPN"
            id="mpn"
            name="mpn"
            onChange={this.handleChange}
            value={fields.mpn.value}
          />
          {fields.mpn.error && <FormHelperText error>{fields.mpn.error}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="name"
            name="name"
            label="Nom"
            value={fields.name.value}
            onChange={this.handleChange}
            error={fields.name.error !== ""}
          />
          {fields.name.error && <FormHelperText error>{fields.name.error}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="shortDescription"
            name="shortDescription"
            label="Description (Courte)"
            value={fields.shortDescription.value}
            onChange={this.handleChange}
            error={fields.shortDescription.error !== ""}
            multiline
            rowsMax="4"
          />
          {fields.shortDescription.error && <FormHelperText error>{fields.shortDescription.error}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="longDescription"
            name="longDescription"
            label="Description (Longue)"
            value={fields.longDescription.value}
            onChange={this.handleChange}
            error={fields.longDescription.error !== ""}
            multiline
            rowsMax="4"
          />
          {fields.longDescription.error &&
          <FormHelperText error>{fields.longDescription.error}</FormHelperText>}
        </FormControl>

        <CategoriesDropdown
          id="categoryId"
          name="categoryId"
          label="Catégorie"
          value={fields.categoryId.value}
          categories={categories}
          containerClass={classes.formControl}
          onChange={event => {
            const {name, value} = event.target;
            updateField(name, value);
          }}
        />

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="input-department">Département</InputLabel>
          <Select
            value={fields.departmentId.value}
            onChange={event => {
              const {name, value} = event.target;
              updateField(name, value);
            }}
            inputProps={{
              id: 'departmentId',
              name: 'departmentId',
            }}>
            {Object.entries(departments).map(([idx, department]) => (
              <MenuItem key={idx} value={department.code}>{department.description.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <ReactTags
          tags={tags}
          suggestions={tagSuggestion}
          handleAddition={this.handleAddTag}
          handleDelete={this.handleDeleteTag}
          allowNew={true}
          autofocus={false}
        />

        <h3>Prix et disponibilité</h3>
        <FormControl>
          <TextField
            id="price"
            name="price"
            label="Prix de détail"
            value={fields.price.value}
            type="number"
            onChange={this.handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            error={fields.price.error !== ""}
          />
          {fields.price.error && <FormHelperText error>{fields.price.error}</FormHelperText>}
        </FormControl>

        <FormControl>
          <TextField
            id="costPrice"
            name="costPrice"
            label="Prix coûtant"
            value={fields.costPrice.value}
            type="number"
            onChange={this.handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            error={fields.costPrice.error !== ""}
          />
          {fields.costPrice.error && <FormHelperText error>{fields.costPrice.error}</FormHelperText>}
        </FormControl>

        <br/>
        <br/>

        {this.renderToggles()}
      </div>
    );
  }

  renderToggles = () => {
    const {fields, classes} = this.props;

    return (
      <div>
        <FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={fields.isKit.value}
                name="isKit"
                color="primary"
                onChange={this.handleSwitchChange}
              />
            }
            label="Ensemble de produits (Kit)"
          />
        </FormControl>

        <br/>

        <FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={fields.isCustom.value}
                name="isCustom"
                color="primary"
                onChange={this.handleSwitchChange}
              />
            }
            label="Produit sur mesure"
          />
        </FormControl>

        <br/>

        <FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={fields.isEnabled.value}
                name="isEnabled"
                onChange={this.handleSwitchChange}
                classes={{
                  switchBase: classes.colorSwitchBase,
                  checked: classes.colorChecked,
                  bar: classes.colorBar,
                }}
              />
            }
            label="Activé"
          />
        </FormControl>
      </div>
    );
  }
}

HomeTab.propTypes = {
  fields: PropTypes.objectOf(PropTypes.object),
  categories: PropTypes.objectOf(PropTypes.object),
  departments: PropTypes.objectOf(PropTypes.object),
};

const mstp = state => ({
  fields: state.productEdit.fields,
  categories: state.shared.data.categories,
  departments: state.shared.data.departments,
});

const mdtp = dispatch => ({
  updateField: (fieldName, value, error) => dispatch(updateField(fieldName, value, error))
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(HomeTab);
