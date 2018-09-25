import React from 'react';
import {compose} from 'redux';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import AttributePicker from "../../shared/AttributePicker/AttributePicker";
import {updateField} from "./index";

const styles = theme => ({});

class AttributesTab extends React.Component {
  render() {
    const {availableAttributes, selectedAttributes, updateField} = this.props;

    return (
      <div>
        <AttributePicker
          availableAttributes={availableAttributes}
          selectedAttributes={selectedAttributes}
          onChange={newAttributes => updateField("attributes", newAttributes)}
        />
      </div>
    );
  }
}

AttributesTab.propTypes = {
  availableAttributes: PropTypes.objectOf(PropTypes.object),
  selectedAttributes: PropTypes.arrayOf(PropTypes.object),
};

const mstp = ({shared, productEdit}) => ({
  availableAttributes: shared.data.attributes,
  selectedAttributes: productEdit.fields.attributes.value
});

const mdtp = dispatch => ({
  updateField: (fieldName, value) => dispatch(updateField(fieldName, value))
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(AttributesTab);