import React from 'react';
import {compose} from 'redux';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import AttributePicker from "../../shared/AttributePicker/AttributePicker";
import {updateField} from "./index";
import Grid from "@material-ui/core/es/Grid/Grid";
import Typography from "@material-ui/core/es/Typography/Typography";
import Icon from "@material-ui/core/es/Icon/Icon";

const styles = theme => ({});

const AttributesTab = ({availableAttributes, selectedAttributes, updateField}) => (
  <Grid container spacing={24}>
    <Grid item xs={12}>
      <Typography variant="h6" gutterBottom><Icon fontSize="inherit">language</Icon> Attributs</Typography>
      <Typography>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda consequuntur deleniti dolorem, doloremque dolores ex facere in ipsum iure minus molestiae non nulla quam quas quia sed sint veritatis voluptatem.</Typography>
    </Grid>

    <Grid item xs={12}>
      <AttributePicker
        availableAttributes={availableAttributes}
        selectedAttributes={selectedAttributes}
        onChange={newAttributes => updateField("attributes", newAttributes)}
      />
    </Grid>
  </Grid>
);

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