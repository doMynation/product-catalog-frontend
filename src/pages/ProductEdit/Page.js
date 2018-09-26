import React, {Component} from 'react';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Loading from "../../shared/Loading";
import ProductRepository from "../../util/ProductRepository";
import Tabs from "@material-ui/core/es/Tabs/Tabs";
import Tab from "@material-ui/core/es/Tab/Tab";
import Icon from "@material-ui/core/es/Icon/Icon";
import TranslationsTab from "./TranslationsTab";
import Paper from "@material-ui/core/es/Paper/Paper";
import PageHeader from "../../layout/PageHeader";
import Grid from "@material-ui/core/es/Grid/Grid";
import connect from "react-redux/es/connect/connect";
import compose from "redux/src/compose";
import HomeTab from "./HomeTab";
import Section from "../../layout/Section";
import {init, updateField} from "./index";
import {receiveSharedData} from "../../shared/index";
import Button from "@material-ui/core/es/Button/Button";
import UpdateDiff from "./UpdateDiff";
import AttributesTab from "./AttributesTab";
import {normalizeList} from "../../util/functions";

const styles = theme => ({
  root: {
    ...theme.layout.pageContainer
  },
  tabContent: {
    padding: theme.spacing.unit * 2
  }
});

const availableLanguages = {
  fr: "Français",
  en: "English",
  es: "Español",
};

class Page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTabIndex: "home",
      productId: props.match.params['productId'],
      product: null,
      isLoading: true,
    }
  }

  componentDidMount() {
    Promise.all([
      ProductRepository.getEditData(this.state.productId),
      ProductRepository.getProductCategories(),
      ProductRepository.getProductDepartments(),
      ProductRepository.getStores(),
      ProductRepository.getAttributes()
    ]).then(data => {
      const [{product, translations}, categories, departments, stores, attributes] = data;

      this.props.init({product, translations});
      this.props.receiveSharedData("categories", normalizeList(categories));
      this.props.receiveSharedData("departments", normalizeList(departments));
      this.props.receiveSharedData("attributes", normalizeList(attributes));

      this.setState({
        isLoading: false,
        categories: categories,
        departments: departments,
        stores: stores,
        product: product,
        form: {
          inputs: {
            name: {
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

    // ProductRepository
    //   .updateProduct(this.state.productId, this.props.diff)
    //   .then(resp => console.log("SUCCSS", resp))
    //   .catch(err => console.log("ERR", err));
  }

  render = () => {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        {this.state.isLoading ? <Loading/> : this.renderForm()}
      </div>
    );
  }

  renderForm = () => {
    const product = this.state.product;
    const inputs = this.state.form.inputs;
    const {selectedTabIndex} = this.state;
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={16}>
            <Grid item container xs={12} justify="space-between">
              <PageHeader text={`[${product.id}] ${product.description.name}`}></PageHeader>

              <Button variant="contained" size="small" type="submit">
                <Icon>save</Icon>
                Save
              </Button>
            </Grid>

            <Grid item xs={12}>{this.renderTabs(selectedTabIndex)}</Grid>

            <Grid item xs={12}>
              <Paper className={classes.tabContent}>
                {selectedTabIndex === "home" && <HomeTab/>}
                {selectedTabIndex === "attributes" && <AttributesTab/>}
                {selectedTabIndex === "translations" && <TranslationsTab
                  translations={inputs.translations.value}
                  onAdd={this.handleAddTranslation}
                  onEdit={this.handleEditTranslations}
                  onDelete={this.handleDeleteTranslation}
                  languages={availableLanguages}
                />}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Section>
                <UpdateDiff />
              </Section>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }

  renderTabs = selectedTabIndex => {
    return (
      <Section>
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
      </Section>
    );
  }
}

const mstp = ({shared, productEdit}) => ({
  categories: shared.data.categories,
  attributes: shared.data.attributes,
  fields: productEdit.fields,
});

const mdtp = dispatch => ({
  init: data => dispatch(init(data)),
  receiveSharedData: (name, data) => dispatch(receiveSharedData(name, data)),
  updateField: (fieldName, value, error) => dispatch(updateField(fieldName, value, error))
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(Page);
