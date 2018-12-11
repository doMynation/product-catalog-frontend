import React from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/es/Grid/Grid";
import Typography from "@material-ui/core/es/Typography/Typography";
import Icon from "@material-ui/core/es/Icon/Icon";
import connect from "react-redux/es/connect/connect";
import withStyles from "@material-ui/core/es/styles/withStyles";
import compose from "redux/src/compose";
import {updateField} from "./index";
import SalesRulesPicker from "../../shared/SalesRulesPicker";

const styles = theme => ({});

const i18n = {
  title: "Règles de vente",
  help: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi, dicta fugit illo labore laborum nihil nobis perferendis possimus recusandae soluta! Autem deleniti fuga impedit quibusdam rerum sequi voluptates voluptatibus? Impedit.",
};

const SalesRules = ({salesRules, updateField}) => (
  <Grid container spacing={24}>
    <Grid item xs={12}>
      <Typography variant="title" gutterBottom><Icon fontSize="inherit">dashboard</Icon> {i18n.title}</Typography>
      <Typography variant="body1">{i18n.help}</Typography>
    </Grid>

    <Grid item xs={12}>
      <SalesRulesPicker
        salesRules={salesRules}
        onChange={newSalesRules => updateField("salesRules", newSalesRules)}
      />
    </Grid>
  </Grid>
);

SalesRules.propTypes = {
  rules: PropTypes.arrayOf(PropTypes.object),
  updateField: PropTypes.func.isRequired
};

const mstp = ({productEdit}) => ({
  salesRules: productEdit.fields.salesRules.value
});

const mdtp = dispatch => ({
  updateField: (fieldName, value, error) => dispatch(updateField(fieldName, value, error))
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(SalesRules);

