import React from 'react';
import PropTypes from 'prop-types';
import TranslationPicker from "../../shared/TranslationPicker";
import Grid from "@material-ui/core/es/Grid/Grid";
import Typography from "@material-ui/core/es/Typography/Typography";
import Icon from "@material-ui/core/es/Icon/Icon";
import connect from "react-redux/es/connect/connect";
import withStyles from "@material-ui/core/es/styles/withStyles";
import compose from "redux/src/compose";
import {updateField} from "./index";

// @todo: Fetch this from the API
const languages = {
  fr: {id: 1, code: "fr", label: "Français"},
  en: {id: 2, code: "en", label: "English"},
  es: {id: 3, code: "es", label: "Español"},
};

const styles = theme => ({});

const TranslationsTab = ({translations, updateField}) => (
  <Grid container spacing={24}>
    <Grid item xs={12}>
      <Typography variant="title" gutterBottom><Icon fontSize="inherit">language</Icon> Traductions</Typography>
      <Typography variant="body1">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda consequuntur deleniti dolorem, doloremque dolores ex facere in ipsum iure minus molestiae non nulla quam quas quia sed sint veritatis voluptatem.</Typography>
    </Grid>

    <Grid item xs={12}>
      <TranslationPicker
        languages={languages}
        translations={translations}
        onChange={newTranslations => updateField("translations", newTranslations)}
      />
    </Grid>
  </Grid>
);

TranslationsTab.propTypes = {
  translations: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mstp = ({productEdit}) => ({
  translations: productEdit.fields.translations.value,
});

const mdtp = dispatch => ({
  updateField: (fieldName, value, error) => dispatch(updateField(fieldName, value, error))
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(TranslationsTab);
