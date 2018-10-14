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
import {init, saveProduct, updateField} from "./index";
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
      this.props.receiveSharedData("stores", normalizeList(stores));

      this.setState({
        isLoading: false,
      });
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.saveProduct();
  }

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        {this.state.isLoading ? <Loading/> : this.renderForm()}
      </div>
    );
  }

  renderForm = () => {
    const {selectedTabIndex} = this.state;
    const {classes, product, isSaveButtonVisible} = this.props;

    return (
      <div className={classes.root}>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={16}>
            <Grid item container xs={12} justify="space-between">
              <PageHeader text={`[${product.id}] ${product.description.name}`}/>

              {isSaveButtonVisible &&
              <Button variant="contained" size="small" type="submit">
                <Icon>save</Icon>
                Save
              </Button>}
            </Grid>

            <Grid item xs={12}>{this.renderTabs(selectedTabIndex)}</Grid>

            <Grid item xs={12}>
              <Paper className={classes.tabContent}>
                {selectedTabIndex === "home" && <HomeTab/>}
                {selectedTabIndex === "attributes" && <AttributesTab/>}
                {selectedTabIndex === "translations" && <TranslationsTab
                  languages={availableLanguages}
                />}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Section>
                <UpdateDiff/>
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
          <Tab icon={<Icon>language</Icon>} label="Traductions" value="translations"/>
          <Tab icon={<Icon>view_comfy</Icon>} label="Attributs" value="attributes"/>
          <Tab icon={<Icon>dashboard</Icon>} label="Composition" value="composition"/>
          <Tab icon={<Icon>attach_money</Icon>} label="Règles de vente" value="salesRules"/>
        </Tabs>
      </Section>
    );
  }
}

const mstp = ({shared, productEdit}) => ({
  product: productEdit.product,
  categories: shared.data.categories,
  attributes: shared.data.attributes,
  fields: productEdit.fields,
  isSaveButtonVisible: productEdit.isSaveButtonVisible,
});

const mdtp = dispatch => ({
  init: data => dispatch(init(data)),
  receiveSharedData: (name, data) => dispatch(receiveSharedData(name, data)),
  updateField: (fieldName, value, error) => dispatch(updateField(fieldName, value, error)),
  saveProduct: () => dispatch(saveProduct()),
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(Page);
