import React, {Component} from 'react';
import withStyles from "@material-ui/core/es/styles/withStyles";
import StorePicker from "./StorePicker";
import Loading from "../../shared/Loading";
import TagsInput from "../../shared/TagsInput";
import ProductRepository from "../../util/ProductRepository";
import CategoriesDropdown from "../../shared/CategoriesDropdown";
import Tabs from "@material-ui/core/es/Tabs/Tabs";
import Tab from "@material-ui/core/es/Tab/Tab";
import Icon from "@material-ui/core/es/Icon/Icon";
import TranslationsTab from "./TranslationsTab";
import Typography from "@material-ui/core/es/Typography/Typography";
import FormControl from "@material-ui/core/es/FormControl/FormControl";
import TextField from "@material-ui/core/es/TextField/TextField";
import Paper from "@material-ui/core/es/Paper/Paper";
import FormHelperText from "@material-ui/core/es/FormHelperText/FormHelperText";
import styles from './styles';

const availableLanguages = {
  fr: "Français",
  en: "English",
  es: "Español",
};

class ProductEditPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTabIndex: "home",
      tagsSuggestion: [
        {name: "model"},
        {name: "kmo"}
      ],
      productId: props.match.params['productId'],
      product: null,
      isLoading: true,
    }
  }

  componentDidMount() {
    const getProducts = () => ProductRepository.getEditData(this.state.productId);
    const getCategories = () => ProductRepository.getProductCategories();
    const getDepartments = () => ProductRepository.getProductDepartments();
    const getStores = () => ProductRepository.getStores();

    Promise.all([getProducts(), getCategories(), getDepartments(), getStores()]).then(data => {
      const [{product, translations}, categories, departments, stores] = data;
      const mpn = "mpn" in product ? product.mpn : "";

      this.setState({
        isLoading: false,
        categories: categories,
        departments: departments,
        stores: stores,
        product: product,
        form: {
          inputs: {
            sku: {
              value: product.sku,
              isDirty: false,
              error: ""
            }, name: {
              value: product.description.name,
              isDirty: false,
              error: ""
            }, shortDescription: {
              value: product.description.shortDescription,
              isDirty: false,
              error: ""
            }, longDescription: {
              value: product.description.longDescription,
              isDirty: false,
              error: ""
            }, mpn: {
              value: mpn,
              isDirty: false,
              error: ""
            }, categoryId: {
              value: product.category.id,
              isDirty: false,
              error: ""
            }, departmentId: {
              value: "TODO",
              isDirty: false,
              error: ""
            }, retailPrice: {
              value: "",
              isDirty: false,
              error: ""
            }, costPrice: {
              value: "",
              isDirty: false,
              error: ""
            }, tags: {
              value: [],
              isDirty: false,
              error: ""
            }, isCustom: {
              value: false,
              isDirty: false,
              error: ""
            }, isEnabled: {
              value: true,
              isDirty: false,
              error: ""
            }, addedStores: {
              value: [],
              isDirty: false,
              error: ""
            }, translations: {
              value: translations,
              isDirty: false,
              error: ""
            }
          }
        }
      });
    });
  }

  isFormValid = () => {
    const inputs = this.state.form.inputs;

    for (let inputName in inputs) {
      if (inputs[inputName].error !== "") {

        return false;
      }
    }

    return true;
  }

  setInputState = (name, value) => {
    this.setState((prevState, props) => {
      return {
        form: {
          ...prevState.form,
          inputs: {
            ...prevState.form.inputs,
            [name]: value
          }
        }
      };
    });
  }

  onTagAdded = newTag => {
    const tags = this.state.form.inputs.tags.value.concat([newTag]);

    this.setInputState("tags", {
      value: tags,
      isDirty: true,
      error: ""
    });
  }

  onTagDeleted = idx => {
    const tags = [...this.state.form.inputs.tags.value];
    tags.splice(idx, 1);

    this.setInputState("tags", {
      value: tags,
      isDirty: true,
      error: ""
    });
  }

  onInputChange = e => {
    const inputName = e.target.name;
    let value = e.target.value;

    // Invert state for checkboxes
    if (e.target.type === "checkbox") {
      value = !this.state.form.inputs[inputName].value;
    }

    const error = this.validateInput(inputName, value);

    this.setInputState(inputName, {
      value: value,
      isDirty: true,
      error: error
    });
  }

  validateInput = (name, value) => {
    switch (name) {
      case "sku":
        if (value === "") {
          return "Requis";
        }

        const skuRegex = /^[\w-]+$/
        if (!skuRegex.test(value)) {
          return "Format invalide: Charactères permis: [a-Z0-9_-]";
        }
        break;

      case "retailPrice":
      case "costPrice":
        return isNaN(parseFloat(value)) ? "Prix invalide" : "";
      default:
        break;
    }

    return "";
  }

  handleAddTranslation = (translation) => {
    this.setInputState("translations", {
      value: this.state.form.inputs.translations.value.concat([translation]),
      isDirty: true,
      error: ""
    });
  }

  handleEditTranslations = (translations) => {
    this.setInputState("translations", {
      value: translations,
      isDirty: true,
      error: ""
    });
  }

  handleDeleteTranslation = (idx) => {
    const updatedTranslations = [...this.state.form.inputs.translations.value];
    updatedTranslations.splice(idx, 1)

    this.setInputState("translations", {
      value: updatedTranslations,
      isDirty: true,
      error: ""
    });
  }

  handleAddStore = (addedStore, price) => {
    const newStore = {
      store: addedStore,
      price: price
    };
    const addedStores = this.state.form.inputs.addedStores.value.concat([newStore]);

    this.setInputState("addedStores", {
      value: addedStores,
      isDirty: true,
      error: ""
    });
  }

  handleDeleteStore = idx => {
    const addedStores = this.state.form.inputs.addedStores.value;

    addedStores.splice(idx, 1);

    this.setInputState("addedStores", {
      value: addedStores,
      isDirty: true,
      error: ""
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let data = {};
    for (const key in this.state.form.inputs) {
      data[key] = this.state.form.inputs[key].value;
    }
  }

  render = () => {
    return (
      <div>
        {this.state.isLoading ?
          <Loading/> :
          this.renderForm()
        }

        <h1>DEBUG</h1>
        <div>
          hi
          {/*<pre>{JSON.stringify(this.state.form, null, 2)}</pre>*/}
        </div>
      </div>
    );
  }

  renderForm = () => {
    const product = this.state.product;
    const inputs = this.state.form.inputs;
    const isValid = this.isFormValid();
    const {selectedTabIndex} = this.state;
    const {classes} = this.props;

    return (
      <div>
        <Typography variant="display2">[{product.id}] {product.description.name}</Typography>

        <Tabs
          value={selectedTabIndex}
          onChange={(e, value) => this.setState({selectedTabIndex: value})}
          fullWidth
          indicatorColor="secondary"
          textColor="secondary"
        >
          <Tab icon={<Icon>home</Icon>} label="Accueil" value="home"/>
          <Tab icon={<Icon>translate</Icon>} label="Traductions" value="translations"/>
          <Tab icon={<Icon>view_comfy</Icon>} label="Attributs" value="attributes"/>
          <Tab icon={<Icon>build</Icon>} label="Composition" value="composition"/>
        </Tabs>

        <form onSubmit={this.handleSubmit}>
          <Paper className={classes.tabContent}>
            {selectedTabIndex === "home" && this.renderHomeTab()}
            {selectedTabIndex === "translations" && <TranslationsTab
              translations={inputs.translations.value}
              onAdd={this.handleAddTranslation}
              onEdit={this.handleEditTranslations}
              onDelete={this.handleDeleteTranslation}
              languages={availableLanguages}
            />}
          </Paper>

          <h3>Prix et disponibilité</h3>
          <div>
            <label htmlFor="retailPrice">Prix de détail</label>
            <input type="text" id="retailPrice" name="retailPrice" onChange={this.onInputChange}/>
            {inputs.retailPrice.error === "" ? '' : <span className="input-error">{inputs.retailPrice.error}</span>}
          </div>

          <div>
            <label htmlFor="costPrice">Prix coûtant</label>
            <input type="text" id="costPrice" name="costPrice" onChange={this.onInputChange}/>
            {inputs.costPrice.error === "" ? '' : <span className="input-error">{inputs.costPrice.error}</span>}
          </div>

          <StorePicker
            stores={this.state.stores}
            handleAdd={this.handleAddStore}
            handleDelete={this.handleDeleteStore}
            addedStores={this.state.form.inputs.addedStores.value}/>

          <br/>
          <br/>
          <br/>

          <div>
            <label htmlFor="isCustom">Produit sur mesure</label>
            <input type="checkbox" id="isCustom" name="isCustom" defaultChecked={inputs.isCustom.value} onChange={this.onInputChange}/>
          </div>

          <div>
            <label htmlFor="isEnabled">Activé</label>
            <input type="checkbox" id="isEnabled" name="isEnabled" defaultChecked={inputs.isEnabled.value} onChange={this.onInputChange}/>
          </div>

          <div>
            <button type="submit" disabled={!isValid}>
              <i className="fas fa-save"></i>
              &nbsp;
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    )
  }

  renderHomeTab = () => {
    const inputs = this.state.form.inputs;
    const {classes} = this.props;

    return (
      <React.Fragment>
        <div className={classes.container}>
          <FormControl className={classes.formControl}>
            <TextField
              error={inputs.sku.error !== ""}
              label="SKU"
              id="sku"
              name="sku"
              onChange={this.onInputChange}
              value={inputs.sku.value}
            />
            {inputs.sku.error !== "" && <FormHelperText error>{inputs.sku.error}</FormHelperText>}
          </FormControl>

          <FormControl className={classes.formControl}>
            <TextField
              error={inputs.mpn.error !== ""}
              label="MPN"
              id="mpn"
              name="mpn"
              onChange={this.onInputChange}
              value={inputs.mpn.value}
            />
            {inputs.mpn.error !== "" && <FormHelperText error>{inputs.mpn.error}</FormHelperText>}
          </FormControl>
        </div>

        <FormControl fullWidth>
          <TextField
            error={inputs.name.error !== ""}
            label="Nom"
            id="name"
            name="name"
            onChange={this.onInputChange}
            value={inputs.name.value}
          />
          {inputs.name.error !== "" && <FormHelperText error>{inputs.name.error}</FormHelperText>}
        </FormControl>

        <FormControl>
          <TextField
            error={inputs.shortDescription.error !== ""}
            label="Description (Courte)"
            id="shortDescription"
            name="shortDescription"
            onChange={this.onInputChange}
            value={inputs.shortDescription.value}
            multiline
            rowsMax="4"
          />
          {inputs.shortDescription.error !== "" &&
          <FormHelperText error>{inputs.shortDescription.error}</FormHelperText>}
        </FormControl>

        {'     '}

        <FormControl>
          <TextField
            error={inputs.longDescription.error !== ""}
            label="Description (Longue)"
            id="longDescription"
            name="longDescription"
            onChange={this.onInputChange}
            value={inputs.longDescription.value}
            multiline
            rowsMax="4"
          />
          {inputs.longDescription.error === "" && <FormHelperText error>{inputs.longDescription.error}</FormHelperText>}
        </FormControl>


        <hr/>

        <div>
          <CategoriesDropdown
            categories={this.state.categories}
            onChange={this.onInputChange}
            value={inputs.categoryId.value}
            id="categoryId"
            name="categoryId"
            label="Catégorie"
            helpText="La catégorie du produit"
          />

          {inputs.categoryId.error === "" ? '' : <span className="input-error">{inputs.categoryId.error}</span>}
        </div>

        <div>
          <label htmlFor="departmentId">Département: </label>
          <select name="departmentId" id="departmentId" value={inputs.departmentId.value} onChange={this.onInputChange}>
            {this.state.departments.map(dept =>
              <option key={dept.id} value={dept.id}>{dept.name}</option>)
            }
          </select>
          {inputs.departmentId.error === "" ? '' : <span className="input-error">{inputs.departmentId.error}</span>}
        </div>

        <div>
          <label htmlFor="">Balises:</label>
          <TagsInput
            tags={inputs.tags.value}
            suggestions={this.state.tagsSuggestion}
            addHandler={this.onTagAdded}
            deleteHandler={this.onTagDeleted}
            allowNew={true}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProductEditPage);
