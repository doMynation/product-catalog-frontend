import React from 'react';
import {compose} from 'redux';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Icon from "@material-ui/core/es/Icon/Icon";
import ValueDiff from "./ValueDiff";
import Typography from "@material-ui/core/es/Typography/Typography";

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
  },
});

class AttributesDiff extends React.Component {
  getAttributeValue = (value, attribute) => {
    return value !== "" && attribute.inputType === "select" ?
      attribute.values.find(v => v.id === value).description.name :
      value;
  }

  renderAdded = (addedAttr, attribute) => {
    return (
      <React.Fragment>
        <Typography variant="caption"><Icon color="primary">add_circle</Icon></Typography>
        <ValueDiff label={attribute.description.name} after={this.getAttributeValue(addedAttr.value, attribute)}/>
      </React.Fragment>
    );
  }

  renderDeleted = (deletedAttr, attribute) => {
    return (
      <React.Fragment>
        <Typography variant="caption"><Icon color="secondary">remove_circle</Icon></Typography>
        <ValueDiff label={attribute.description.name} before={this.getAttributeValue(deletedAttr.value, attribute)}/>
      </React.Fragment>
    );
  }

  renderUpdated = (oldAttr, newAttr, attribute) => {
    const oldValue = `${this.getAttributeValue(oldAttr.value, attribute)} (${oldAttr.isEditable ? "Modifiable" : "Non modifiable"})`;
    const newValue = `${this.getAttributeValue(newAttr.value, attribute)} (${newAttr.isEditable ? "Modifiable" : "Non modifiable"})`;

    return (
      <React.Fragment>
        <Icon color="primary">edit</Icon>
        <ValueDiff label={attribute.description.name} before={oldValue} after={newValue}/>
      </React.Fragment>
    );
  }

  render() {
    const {classes, added, updated, deleted, attributes} = this.props;

    return (
      <div className={classes.root}>
        {added.map((attr, idx) => {
          const matchingAttr = attributes[attr.id];
          return <div key={`attr-diff-add-${idx}`} className={classes.item}>{this.renderAdded(attr, matchingAttr)}</div>;
        })}

        {updated.map((pair, idx) => {
          const matchingAttr = attributes[pair[0].id];
          return <div key={`attr-diff-upd-${idx}`} className={classes.item}>{this.renderUpdated(pair[0], pair[1], matchingAttr)}</div>;
        })}

        {deleted.map((attr, idx) => {
          const matchingAttr = attributes[attr.id];
          return <div key={`attr-diff-del-${idx}`} className={classes.item}>{this.renderDeleted(attr, matchingAttr)}</div>;
        })}
      </div>
    );
  }
}

AttributesDiff.propTypes = {
  added: PropTypes.arrayOf(PropTypes.object),
  updated: PropTypes.arrayOf(PropTypes.array),
  deleted: PropTypes.arrayOf(PropTypes.object),
  attributes: PropTypes.objectOf(PropTypes.object),
};

const mstp = ({shared}) => ({
  attributes: shared.data.attributes
});

export default compose(
  withStyles(styles),
  connect(mstp)
)(AttributesDiff);

