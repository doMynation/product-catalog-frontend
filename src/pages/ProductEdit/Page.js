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
import {init, openSaveDialog, updateField} from "./index";
import {fetchSharedDataIfNeeded} from "../../shared/index";
import Button from "@material-ui/core/es/Button/Button";
import AttributesTab from "./AttributesTab";
import CompositionTab from "./CompositionTab";
import ProductName from "../../shared/ProductName";
import SaveDialog from "./SaveDialog";
import SalesRulesTab from "./SalesRulesTab";
import Layout from "../../layout/Layout";

const styles = theme => ({
  root: {
    ...theme.layout.pageContainer
  },
  tabContent: {
    padding: theme.spacing.unit * 2
  }
});

class Page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTabIndex: "home",
      productId: props.match.params['productId'],
      isLoading: true,
      isDiffDialogOpen: false,
    }
  }

  componentDidMount() {
    ProductRepository
      .getEditData(this.state.productId)
      .then(data => {
        this.props.fetchSharedDataIfNeeded(() => {
          this.props.init(data);

          this.setState({
            isLoading: false,
          });
        });
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.openSaveDialog();
  }

  render() {
    const {classes} = this.props;

    return (
      <Layout>
        <div className={classes.root}>
          {this.state.isLoading ? <Loading/> : this.renderForm()}

          <SaveDialog/>
        </div>
      </Layout>
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
              <PageHeader>
                <ProductName sku={product.sku} name={product.description.name}/>
              </PageHeader>

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
                {selectedTabIndex === "translations" && <TranslationsTab/>}
                {selectedTabIndex === "composition" && <CompositionTab children={product.children}/>}
                {selectedTabIndex === "salesRules" && <SalesRulesTab salesRules={product.rules}/>}
              </Paper>
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
  updateField: (fieldName, value, error) => dispatch(updateField(fieldName, value, error)),
  openSaveDialog: () => dispatch(openSaveDialog()),
  fetchSharedDataIfNeeded: onComplete => dispatch(fetchSharedDataIfNeeded(onComplete))
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(Page);
