import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import AutoComplete from "./AutoComplete";
import AttributeInput from "./AttributeInput";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Icon from "@material-ui/core/es/Icon/Icon";
import List from "@material-ui/core/es/List/List";

const styles = theme => ({
  listItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit,
    padding: theme.spacing.unit / 2,
    backgroundColor: theme.palette.grey[100]
  },
  deleteButton: {
    marginRight: theme.spacing.unit
  }
});

class AttributePicker extends Component {
  state = {
    selectedAttributes: [],
    attributeValue: ""
  };

  handleAdd = selectedAttribute => {
    const newAttribute = {...selectedAttribute, value: ""};
    const newSelectedAttributes = this.state.selectedAttributes.concat([newAttribute])

    this.setState({
      selectedAttributes: newSelectedAttributes
    });

    // Emit changes
    this.props.onChange(newSelectedAttributes);
  }

  handleDelete = idx => {
    const newSelectedAttributes = this.state.selectedAttributes.filter((e, i) => i !== idx);

    this.setState({
      selectedAttributes: newSelectedAttributes
    });

    // Emit changes
    this.props.onChange(newSelectedAttributes);
  }

  handleChange = (idx, value) => {
    const newSelectedAttributes = [...this.state.selectedAttributes]
    newSelectedAttributes[idx] = {...newSelectedAttributes[idx], value: value};

    this.setState({
      selectedAttributes: newSelectedAttributes
    });

    // Emit changes
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
    const {availableAttributes} = this.props;
    const {selectedAttributes} = this.state;

    return (
      <div>
        <AutoComplete
          onChange={this.handleAdd}
          options={availableAttributes}
          placeholder="Tapez le nom d'un attribut ..."
        />

        <List>
          {selectedAttributes.map((attribute, idx) => this.renderAttribute(attribute, idx))}
        </List>
      </div>
    );
  }
}

AttributePicker.propTypes = {
  availableAttributes: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(AttributePicker);
