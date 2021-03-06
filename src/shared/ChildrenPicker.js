import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import AutoComplete from "./AutoComplete";
import ProductChildField from "../pages/ProductEdit/ProductChildField";
import ProductRepository from "../util/ProductRepository";
import Collapse from "@material-ui/core/es/Collapse/Collapse";
import Grid from "@material-ui/core/es/Grid/Grid";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Icon from "@material-ui/core/es/Icon/Icon";
import moment from "moment";
import Loading from "./Loading";
import SavedTemplates from "./SavedTemplates/SavedTemplates";
import {suggestProduct} from "../util/functions";

const LOCAL_STORAGE_KEY = "SavedTemplates::COMPOSITION";
const i18n = {
  autocompletePlaceholder: "Tapez le nom ou SKU d'une pièce (ex: ATT90) ...",
};

const styles = theme => ({
  childrenContainer: {
    marginTop: theme.spacing.unit * 2
  }
});

const createChild = product => ({
  id: `NEW_${Math.random() * 20}`,
  isVisible: false,
  isCompiled: false,
  product: product,
  childType: "composed",
  quantity: 1,
});

class ChildrenPicker extends Component {
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
      children: this.props.children.map(child => ({
        productId: child.product.id,
        childType: child.childType,
        isVisible: child.isVisible,
        isCompiled: child.isCompiled,
        quantity: child.quantity
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
    const productIds = template.children.map(child => child.productId).join(",")

    this.setState({
      isLoading: true,
      isSavedTemplateMode: false
    });

    ProductRepository
      .get(productIds)
      .then(apiProducts => {
        const products = Array.isArray(apiProducts) ? apiProducts : [apiProducts];

        const children = template.children.reduce((acc, child) => {
          const matchingProduct = products.find(product => product.id === child.productId)

          if (matchingProduct === undefined) {
            return acc;
          }

          const newChild = createChild(matchingProduct);
          newChild.childType = child.childType;
          newChild.isVisible = child.isVisible;
          newChild.isCompiled = child.isCompiled;
          newChild.quantity = child.quantity;

          return acc.concat(newChild);
        }, []);

        const newChildren = this.props.children.concat(children);

        this.setState({isLoading: false});
        this.props.onChange(newChildren)
      });
  }

  toggleSavedTemplateMode = () => {
    this.setState(state => ({
      isSavedTemplateMode: !state.isSavedTemplateMode
    }));
  }

  handleAdd = product => {
    // Prevent duplicates
    const exists = this.props.children.some(child => child.product.id === product.id)

    if (exists) {
      return;
    }

    const newChildren = this.props.children.concat(createChild(product));

    this.props.onChange(newChildren);
  }

  handleDelete = idx => {
    const newChildren = [...this.props.children];
    newChildren.splice(idx, 1);

    this.props.onChange(newChildren);
  }

  handleChange = (key, newChild) => {
    const newChildren = [...this.props.children];
    newChildren[key] = newChild;

    this.props.onChange(newChildren);
  }

  render() {
    const {classes, children, isLoading} = this.props;
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
              {children.map((child, key) =>
                <ProductChildField
                  key={`child_${key}`} child={child}
                  onChange={newChild => this.handleChange(key, newChild)}
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

ChildrenPicker.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(ChildrenPicker);
