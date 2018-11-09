import React from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/es/Grid/Grid";
import Typography from "@material-ui/core/es/Typography/Typography";
import Icon from "@material-ui/core/es/Icon/Icon";
import connect from "react-redux/es/connect/connect";
import withStyles from "@material-ui/core/es/styles/withStyles";
import compose from "redux/src/compose";
import {updateField} from "./index";
import ChildrenPicker from "../../shared/AttributePicker/ChildrenPicker";

const styles = theme => ({});

const CompositionTab = ({children, updateField}) => (
  <Grid container spacing={24}>
    <Grid item xs={12}>
      <Typography variant="title" gutterBottom><Icon fontSize="inherit">dashboard</Icon> Composition</Typography>
      <Typography variant="body1">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda consequuntur deleniti dolorem, doloremque dolores ex facere in ipsum iure minus molestiae non nulla quam quas quia sed sint veritatis voluptatem.</Typography>
    </Grid>

    <Grid item xs={12}>
      <ChildrenPicker
        children={children}
        onChange={newChildren => updateField("children", newChildren)}
      />
    </Grid>
  </Grid>
);

CompositionTab.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object),
  updateField: PropTypes.func.isRequired
};

const mstp = ({productEdit}) => ({
  children: productEdit.fields.children.value
});

const mdtp = dispatch => ({
  updateField: (fieldName, value, error) => dispatch(updateField(fieldName, value, error))
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(CompositionTab);
