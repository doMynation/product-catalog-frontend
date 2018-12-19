import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import compose from "redux/src/compose";
import TextField from "@material-ui/core/es/TextField/TextField";
import FormHelperText from "@material-ui/core/es/FormHelperText/FormHelperText";
import FormControl from "@material-ui/core/es/FormControl/FormControl";
import {updateField} from "./index";
import connect from "react-redux/es/connect/connect";
import CategoryPicker from "../../shared/CategoryPicker";
import ReactTags from 'react-tag-autocomplete'
import 'react-tag-autocomplete/example/styles.css'
import InputLabel from "@material-ui/core/es/InputLabel/InputLabel";
import Select from "@material-ui/core/es/Select/Select";
import MenuItem from "@material-ui/core/es/MenuItem/MenuItem";
import InputAdornment from "@material-ui/core/es/InputAdornment/InputAdornment";
import FormControlLabel from "@material-ui/core/es/FormControlLabel/FormControlLabel";
import Switch from "@material-ui/core/es/Switch/Switch";
import Grid from "@material-ui/core/es/Grid/Grid";
import Typography from "@material-ui/core/es/Typography/Typography";
import Icon from "@material-ui/core/es/Icon/Icon";
import Uploader from "../../shared/Uploader";
import StorePicker from "./StorePicker";

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
  image: {},
  imageContainer: {
    textAlign: 'center'
  },
  extrusionThumbnail: {
    maxWidth: 50,
    height: 30,
    marginRight: theme.spacing.unit,
    border: '1px dashed #CCC',
  },
  selectedExtrusion: {
    maxWidth: 50,
    height: 10,
    marginRight: theme.spacing.unit,
    border: '1px dashed #CCC',
  }
});

const tagSuggestion = ["model", "kmo"].map(name => ({name: name}));
const acceptedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/tiff'];
const i18n = {
  priceSectionTitle: "Prix et disponibilité",
  retailPrice: "Prix de détail",
};

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

  handleNameChange = e => {
    const {value} = e.target;

    const newTranslations = this.props.fields.translations.value.reduce((acc, tr) => {
      if (tr.isDefault) {
        tr.name = value
      }

      acc.push(tr);

      return acc;
    }, []);

    this.props.updateField("translations", newTranslations);
  }

  handleSwitchChange = e => {
    const {name} = e.target;

    if (this.props.fields[name].value)
      this.props.updateField(name, false);
    else
      this.props.updateField(name, true);
  }

  render() {
    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Typography variant="title"><Icon>home</Icon> Accueil</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          {this.renderLeftSide()}
        </Grid>

        <Grid item xs={12} sm={6}>
          {this.renderRightSide()}
        </Grid>
      </Grid>
    );
  }

  renderLeftSide() {
    const {fields, classes, updateField, categories, departments, extrusions} = this.props;
    const tags = fields.tags.value.map(tag => ({name: tag}));
    const defaultTranslationIdx = fields.translations.value.findIndex(tr => tr.isDefault);

    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <TextField
              id="name"
              name="name"
              label="Nom *"
              value={fields.translations.value[defaultTranslationIdx].name}
              onChange={this.handleNameChange}
              error={Boolean(fields.translations.error[defaultTranslationIdx])}
            />
            {fields.translations.error[defaultTranslationIdx] !== "" &&
            <FormHelperText error>{fields.translations.error[defaultTranslationIdx]}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextField
              fullWidth
              error={fields.sku.error !== ""}
              label="SKU *"
              id="sku"
              name="sku"
              onChange={this.handleChange}
              value={fields.sku.value}
            />
            {fields.sku.error &&
            <FormHelperText error>{fields.sku.error}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextField
              error={fields.mpn.error !== ""}
              label="MPN"
              id="mpn"
              name="mpn"
              onChange={this.handleChange}
              value={fields.mpn.value}
            />
            {fields.mpn.error &&
            <FormHelperText error>{fields.mpn.error}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <CategoryPicker
            id="categoryId"
            name="categoryId"
            label="Catégorie"
            value={fields.categoryId.value}
            categories={categories}
            containerClass={classes.formControl}
            formControlProps={{fullWidth: true}}
            onChange={event => {
              const {name, value} = event.target;
              updateField(name, value);
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel htmlFor="departmentId">Département</InputLabel>
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
              <MenuItem value={""}>Aucun</MenuItem>
              {Object.entries(departments).map(([idx, department]) => (
                <MenuItem key={idx} value={department.id}>{department.description.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="caption" paragraph>
            La <strong>catégorie</strong> correspond au <strong>type du produit</strong>.
            Par exemple, une vis fait partie de la catégorie Quincaillerie.
          </Typography>
          <Typography variant="caption" paragraph>
            Le <strong>départment</strong> correspond au département qui <strong>gère le produit au niveau de la production</strong>.
            Par exemple, une entremise en alumium est créée et gérée par le département de l'aluminium.
          </Typography>
          <Typography variant="caption" paragraph>
            Notez qu'il existe des cas spéciaux, où la catégorie et le département n'ont rien en commun.
            Prenons l'exemple du DVD d'installation, dont la <strong>catégorie est Documentation</strong> et le <strong>département Aluminium</strong>, car c'est ce dernier qui l'emballe.
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="extrusionId">Extrusion</InputLabel>
            <Select
              value={fields.extrusionId.value}
              renderValue={extrusionId => {
                const extrusion = extrusions[extrusionId];
                return (
                  <div>
                    <img src={extrusion.imageUrl} alt={extrusion.name} className={classes.selectedExtrusion}/>
                    {extrusion.templateName}
                  </div>
                );
              }}
              onChange={event => {
                const {name, value} = event.target;
                updateField(name, value);
              }}
              inputProps={{
                id: 'extrusionId',
                name: 'extrusionId',
              }}>
              <MenuItem value={""}>Aucune</MenuItem>
              {Object.entries(extrusions).map(([idx, extrusion]) => (
                <MenuItem key={idx} value={extrusion.id}>
                  <img src={extrusion.imageUrl} alt={extrusion.name} className={classes.extrusionThumbnail}/>
                  {extrusion.templateName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="stickerId">Étiquette</InputLabel>
            <Select
              value={fields.stickerId.value}
              onChange={event => {
                const {name, value} = event.target;
                updateField(name, value);
              }}
              inputProps={{
                id: 'stickerId',
                name: 'stickerId',
              }}>
              <MenuItem value={""}>Aucune</MenuItem>
              <MenuItem value="1">Petit (4x1)</MenuItem>
              <MenuItem value="2">Gros (4x3)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <ReactTags
            tags={tags}
            suggestions={tagSuggestion}
            handleAddition={this.handleAddTag}
            handleDelete={this.handleDeleteTag}
            allowNew={true}
            autofocus={false}
            placeholder="Étiquettes ..."
          />
        </Grid>

        <Grid item xs={12}>
          {this.renderToggles()}
        </Grid>
      </Grid>
    );
  }

  renderRightSide() {
    const {fields} = this.props;

    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Grid container spacing={24}>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <TextField
                  id="price"
                  name="price"
                  label={i18n.retailPrice}
                  value={fields.price.value}
                  type="number"
                  onChange={this.handleChange}
                  onFocus={e => e.target.select()}
                  InputProps={{
                    startAdornment:
                      <InputAdornment position="start">$</InputAdornment>,
                  }}
                  error={fields.price.error !== ""}
                />
                {fields.price.error &&
                <FormHelperText error>{fields.price.error}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <FormControl fullWidth>
                <TextField
                  id="costPrice"
                  name="costPrice"
                  label="Prix coûtant"
                  value={fields.costPrice.value}
                  type="number"
                  onChange={this.handleChange}
                  onFocus={e => e.target.select()}
                  InputProps={{
                    startAdornment:
                      <InputAdornment position="start">$</InputAdornment>,
                  }}
                  error={fields.costPrice.error !== ""}
                />
                {fields.costPrice.error &&
                <FormHelperText error>{fields.costPrice.error}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>

          <StorePicker
            stores={this.props.stores}
            addedStores={[]}
            handleAdd={s => console.log('added', s)}
            handleDelete={s => console.log('deleted', s)}
          />
        </Grid>

        <Grid item xs={12}>
          <Uploader
            acceptedFileTypes={acceptedFileTypes}
            files={fields.imageUrl.value !== "" ? [fields.imageUrl.value] : []}
            onFilesChanged={files => {
              const fileUrl = files[0] === undefined ? "" : files[0];
              updateField("imageUrl", fileUrl)
            }}
          />
        </Grid>
      </Grid>
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
  extrusions: state.shared.data.extrusions,
  stores: state.shared.data.stores,
});

const mdtp = dispatch => ({
  updateField: (fieldName, value, error) => dispatch(updateField(fieldName, value, error))
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(HomeTab);
