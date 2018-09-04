import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import AttributeInput from "./AttributeInput";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Icon from "@material-ui/core/es/Icon/Icon";
import List from "@material-ui/core/es/List/List";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import Collapse from "@material-ui/core/es/Collapse/Collapse";
import SavedTemplates from "./SavedTemplates";
import AutoComplete from "../AutoComplete";
import moment from "moment";

const styles = theme => ({
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit,
    padding: theme.spacing.unit / 2,
    backgroundColor: theme.palette.grey[100],
    borderColor: theme.palette.grey[500],
    borderWidth: 1,
    borderRadius: theme.spacing.unit
  },
  deleteButton: {
    marginRight: theme.spacing.unit
  }
});

class AttributePicker extends Component {
  state = {
    isSavedTemplateMode: false,
    savedTemplates: []
  };

  componentDidMount() {
    // Load saved templates from localStorage
    const data = localStorage.getItem("ATTRIBUTE_PICKER_TEMPLATES");
    const savedTemplates = data === null ? [] : JSON.parse(data);

    this.setState({savedTemplates: savedTemplates});
  }

  componentWillUnmount() {
    // Store saved templates in localStorage when the component is about to be destroyed
    localStorage.setItem("ATTRIBUTE_PICKER_TEMPLATES", JSON.stringify(this.state.savedTemplates));
  }

  toggleSavedTemplateMode = () => {
    this.setState(state => ({isSavedTemplateMode: !state.isSavedTemplateMode}));
  }

  handleAddSavedTemplate = templateName => {
    const newTemplate = {
      name: templateName,
      date: moment().format("YYYY-MM-DD H:mm"),
      items: this.props.selectedAttributes.map(attr => ({id: attr.id, value: attr.value}))
    };

    const newSavedTemplates = this.state.savedTemplates.concat([newTemplate]);

    this.setState({savedTemplates: newSavedTemplates});
  }

  handleDeleteSavedTemplate = idx => {
    const newSavedTemplates = [...this.state.savedTemplates];

    newSavedTemplates.splice(idx, 1);

    this.setState({savedTemplates: newSavedTemplates});
  }

  handleSelectSavedTemplate = idx => {
    const template = this.state.savedTemplates[idx];

    if (template === undefined) {
      return;
    }

    const newSelectedAttributes = template.items.reduce((acc, savedAttr) => {
      const newAttribute = this.props.availableAttributes.find(attr => attr.id === savedAttr.id);

      if (newAttribute === undefined) {
        return acc;
      }

      return acc.concat([{...newAttribute, value: savedAttr.value}]);
    }, []);

    this.props.onChange(newSelectedAttributes);
    this.toggleSavedTemplateMode();
  }

  handleAdd = selection => {
    if (selection === undefined || selection.length === 0) {
      return;
    }

    const newAttribute = {...selection.value, value: ""};
    const newSelectedAttributes = this.props.selectedAttributes.concat([newAttribute]);

    this.props.onChange(newSelectedAttributes);
  }

  handleDelete = idx => {
    const newSelectedAttributes = this.props.selectedAttributes.filter((e, i) => i !== idx);

    this.props.onChange(newSelectedAttributes);
  }

  handleChange = (idx, value) => {
    const newSelectedAttributes = [...this.props.selectedAttributes];
    newSelectedAttributes[idx] = {...newSelectedAttributes[idx], value: value};

    this.props.onChange(newSelectedAttributes);
  }

  renderAttribute(attribute, idx) {
    const {classes} = this.props;

    return (
      <div key={'attribute_idx_' + idx} className={classes.listItem}>
        <IconButton aria-label="Supprimer" onClick={() => this.handleDelete(idx)} className={classes.deleteButton}>
          <Icon>delete</Icon>
        </IconButton>

        <AttributeInput
          attribute={attribute}
          value={attribute.value}
          onChange={value => this.handleChange(idx, value)}
        />
      </div>
    );
  }

  render() {
    const {classes, availableAttributes, selectedAttributes} = this.props;
    const {savedTemplates, isSavedTemplateMode} = this.state;
    const notSelectedAttributes = availableAttributes.filter(attribute => {
      return !selectedAttributes.some(inner => inner.id === attribute.id);
    });

    const options = notSelectedAttributes.map(attribute => ({value: attribute, label: attribute.description.name}));

    return (
      <React.Fragment>
        <Collapse in={!isSavedTemplateMode}>
          <div className={classes.header}>
            <AutoComplete
              onChange={this.handleAdd}
              options={options}
              placeholder="Tapez le nom d'un attribut ..."
            />

            <div className={classes.header}>
              <Tooltip title="Listes sauvegardées ..." placement="top">
                <IconButton aria-label="" onClick={this.toggleSavedTemplateMode}>
                  <Icon>history</Icon>
                </IconButton>
              </Tooltip>
            </div>
          </div>

          <List>
            {selectedAttributes.map((attribute, idx) => this.renderAttribute(attribute, idx))}
          </List>
        </Collapse>

        <Collapse in={isSavedTemplateMode}>
          <SavedTemplates
            items={savedTemplates}
            onSelect={this.handleSelectSavedTemplate}
            onAdd={this.handleAddSavedTemplate}
            onDelete={this.handleDeleteSavedTemplate}
            onClose={this.toggleSavedTemplateMode}
            allowSave={selectedAttributes.length > 0}
          />
        </Collapse>
      </React.Fragment>
    );
  }
}

AttributePicker.propTypes = {
  availableAttributes: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(AttributePicker);
