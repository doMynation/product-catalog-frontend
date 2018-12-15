import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import AutoComplete from "./AutoComplete";
import Collapse from "@material-ui/core/es/Collapse/Collapse";
import Grid from "@material-ui/core/es/Grid/Grid";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Icon from "@material-ui/core/es/Icon/Icon";
import moment from "moment";
import Loading from "./Loading";
import SavedTemplates from "./SavedTemplates/SavedTemplates";

const LOCAL_STORAGE_KEY = "SavedTemplates::SALES_RULES";
const i18n = {
  autocompletePlaceholder: "Tapez le nom ou SKU d'un produit (ex: ATT90) ...",
};

const styles = theme => ({
  childrenContainer: {
    marginTop: theme.spacing.unit * 2
  }
});

class Picker extends Component {
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
      data: this.props.createSavedTemplate(this.props.data)
    };

    const newSavedTemplates = this.state.savedTemplates.concat([newTemplate]);

    this.setState({savedTemplates: newSavedTemplates});
  }

  handleSelectSavedTemplate = idx => {
    const template = this.state.savedTemplates[idx];

    if (template === undefined) {
      return;
    }

    this.setState({
      isLoading: true,
      isSavedTemplateMode: false
    });

    this.props.onSelectSavedTemplate(idx);
  }

  toggleSavedTemplateMode = () => {
    this.setState(state => ({
      isSavedTemplateMode: !state.isSavedTemplateMode
    }));
  }

  handleDelete = idx => {
    const newData = [...this.props.data];
    newData.splice(idx, 1);

    this.props.onChange(newData);
  }

  handleChange = (key, updatedData) => {
    const newData = [...this.props.data];
    newData[key] = updatedData;

    this.props.onChange(newData);
  }

  render() {
    const {classes, data, isLoading, onSelectData, onSearch, renderData, renderSearchResult} = this.props;
    const {isSavedTemplateMode, savedTemplates} = this.state;

    return (
      <div>
        <Collapse in={!isSavedTemplateMode}>
          <Grid container alignItems="center" justify="space-around">
            <Grid item xs={11}>
              <AutoComplete
                onChange={selected => onSelectData(selected.value)}
                formatOption={({value}) => renderSearchResult(value)}
                placeholder={i18n.autocompletePlaceholder}
                isAsync
                asyncFetch={onSearch}
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
            <div><Loading/></div> :
            <div className={classes.childrenContainer}>
              {data.map((item, key) => renderData({
                key,
                item,
                defaultOnChange: this.handleChange,
                defaultOnDelete: this.handleDelete
              }))}
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

Picker.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  renderData: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  renderSearchResult: PropTypes.func.isRequired,
  onSelectData: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  savedTemplates: PropTypes.arrayOf(PropTypes.object),
};

/*
// Usage example [wip]...
      <Picker
        onChange={newSalesRules => updateField("salesRules", newSalesRules)}
        data={salesRules}
        renderData={({key, item, defaultOnChange, defaultOnDelete}) =>
          <SalesRule
            key={`rule_${key}`}
            rule={item}
            onChange={newRule => defaultOnChange(key, newRule)}
            onDelete={newRule => defaultOnDelete(key, newRule)}
          />
        }
        onSelectData={product => createRule(product)}
        onSearch={suggestProduct}
        renderSearchResult={product => `[${product.sku}] ${product.description.name}`}
        savedTemplates={getSavedTemplates()}
        onSelectSavedTemplate={idx => console.log("selected " + idx)}
        onDeleteSavedTemplate={idx => console.log("deleted " + idx)}
      />
 */

export default withStyles(styles)(Picker);
