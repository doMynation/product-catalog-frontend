import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import AutoComplete from "./AutoComplete";
import ProductRepository from "../util/ProductRepository";
import Collapse from "@material-ui/core/es/Collapse/Collapse";
import Grid from "@material-ui/core/es/Grid/Grid";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Icon from "@material-ui/core/es/Icon/Icon";
import moment from "moment";
import Loading from "./Loading";
import {suggestProduct} from "../util/functions";
import SavedTemplates from "./SavedTemplates/SavedTemplates";
import SalesRule from "../pages/ProductEdit/SalesRule";

const LOCAL_STORAGE_KEY = "SavedTemplates::SALES_RULES";
const i18n = {
  autocompletePlaceholder: "Tapez le nom ou SKU d'un produit (ex: ATT90) ...",
};

const styles = theme => ({
  childrenContainer: {
    marginTop: theme.spacing.unit * 2
  }
});

const createRule = product => ({
  id: `NEW_${Math.random() * 20}`,
  product: product,
  ruleType: "normal",
  newPrice: product.price,
  quantity: 1,
});

class SalesRulesPicker extends Component {
  state = {
    isSavedTemplateMode: false,
    isLoading: false,
    savedTemplates: []
  };

  componentDidMount() {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    const templates = data === null ? [] : JSON.parse(data);

    this.setState({
      savedTemplates: templates
    });
  }

  componentWillUnmount() {
    this.persistState();
  }

  persistState = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.state.savedTemplates));
  }

  handleDeleteSavedTemplate = idx => {
    const newSavedTemplates = [...this.state.savedTemplates];
    newSavedTemplates.splice(idx, 1);

    this.setState({savedTemplates: newSavedTemplates});
  }

  handleAddSavedTemplate = templateName => {
    const newTemplate = {
      name: templateName,
      date: moment().format("YYYY-MM-DD H:mm"),
      salesRules: this.props.salesRules.map(rule => ({
        productId: rule.product.id,
        ruleType: rule.ruleType,
        newPrice: rule.price,
        quantity: rule.quantity,
      }))
    };

    const newSavedTemplates = this.state.savedTemplates.concat([newTemplate]);

    this.setState({savedTemplates: newSavedTemplates});
  }

  handleSelectSavedTemplate = idx => {
    const template = this.state.savedTemplates[idx];

    if (template === undefined) {
      return;
    }

    // Fetch products
    const productIds = template.salesRules.map(rule => rule.productId).join(",")

    this.setState({
      isLoading: true,
      isSavedTemplateMode: false
    });

    ProductRepository
      .get(productIds)
      .then(apiProducts => {
        const products = Array.isArray(apiProducts) ? apiProducts : [apiProducts];

        const rules = template.salesRules.reduce((acc, rule) => {
          const matchingProduct = products.find(product => product.id === rule.productId)

          if (matchingProduct === undefined) {
            return acc;
          }

          const newRule = createRule(matchingProduct);
          newRule.ruleType = rule.ruleType;
          newRule.newPrice = rule.newPrice;
          newRule.quantity = rule.quantity;

          return acc.concat(newRule);
        }, []);

        const newRules = this.props.salesRules.concat(rules);

        this.setState({isLoading: false});
        this.props.onChange(newRules)
      });
  }

  toggleSavedTemplateMode = () => {
    this.setState(state => ({
      isSavedTemplateMode: !state.isSavedTemplateMode
    }));
  }

  handleAdd = product => {
    // Prevent duplicates
    const exists = this.props.salesRules.some(rule => rule.product.id === rule.id)

    if (exists) {
      return;
    }

    const newRules = this.props.salesRules.concat(createRule(product));

    this.props.onChange(newRules);
  }

  handleDelete = idx => {
    const newRules = [...this.props.salesRules];
    newRules.splice(idx, 1);

    this.props.onChange(newRules);
  }

  handleChange = (key, newRule) => {
    const newRules = [...this.props.salesRules];
    newRules[key] = newRule;

    this.props.onChange(newRules);
  }

  render() {
    const {classes, salesRules, isLoading} = this.props;
    const {isSavedTemplateMode, savedTemplates} = this.state;

    return (
      <div>
        <Collapse in={!isSavedTemplateMode}>
          <Grid container alignItems="center" justify="space-around">
            <Grid item xs={11}>
              <AutoComplete
                onChange={selected => this.handleAdd(selected.value)}
                formatOption={({value}) => `[${value.sku}] ${value.description.name}`}
                placeholder={i18n.autocompletePlaceholder}
                isAsync
                asyncFetch={suggestProduct}
                clearOnSelect
              />
            </Grid>

            <Grid item xs={1}>
              <Tooltip title="Listes sauvegardées ..." placement="top">
                <IconButton aria-label="" onClick={this.toggleSavedTemplateMode}>
                  <Icon>history</Icon>
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>

          {isLoading ?
            <div><Loading/></div>
            :
            <div className={classes.childrenContainer}>
              {salesRules.map((rule, key) =>
                <SalesRule
                  key={`rule_${key}`}
                  rule={rule}
                  onChange={newRule => this.handleChange(key, newRule)}
                  onDelete={() => this.handleDelete(key)}
                />
              )}
            </div>
          }
        </Collapse>

        <Collapse in={isSavedTemplateMode}>
          <SavedTemplates
            items={savedTemplates}
            onSelect={this.handleSelectSavedTemplate}
            onAdd={this.handleAddSavedTemplate}
            onDelete={this.handleDeleteSavedTemplate}
            onClose={this.toggleSavedTemplateMode}
          />
        </Collapse>
      </div>
    );
  }
}

SalesRulesPicker.propTypes = {
  salesRules: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(SalesRulesPicker);

