import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import AutoComplete from "./AutoComplete";
import Grid from "@material-ui/core/es/Grid/Grid";
import TranslationField from "./TranslationField";

const styles = theme => ({});

class TranslationPicker extends React.PureComponent {
  handleAdd = selection => {
    const newTranslations = this.props.translations.concat({
      lang: selection.value,
      name: "",
      shortDescription: "",
      longDescription: "",
      isDefault: false
    });

    this.props.onChange(newTranslations);
  }

  handleChange = (newTranslation, key) => {
    const newTranslations = [...this.props.translations];
    newTranslations[key] = newTranslation;

    this.props.onChange(newTranslations);
  }

  handleDelete = key => {
    const newTranslations = [...this.props.translations];
    newTranslations.splice(key, 1);

    this.props.onChange(newTranslations);
  }

  handleMakeDefault = key => {
    const newTranslations = this.props.translations.reduce((acc, translation, idx) => {
      translation.isDefault = key === idx;

      acc.push(translation);

      return acc;
    }, []);

    this.props.onChange(newTranslations);
  }

  render() {
    const {languages, translations} = this.props;
    const availableLanguages = Object.values(languages).filter(lang => translations.every(tr => tr.lang !== lang.code));
    const options = availableLanguages.map(lang => ({value: lang.code, label: lang.label}));

    return (
      <React.Fragment>
        <AutoComplete
          onChange={this.handleAdd}
          options={options}
          placeholder="Tapez le nom d'une langue ..."
          clearOnSelect={true}
        />

        <br/>

        <Grid container spacing={16}>
          {translations.map((tr, key) =>
            <Grid item md={6} key={`translation_${key}`}>
              <TranslationField
                key={'translation_' + key}
                translation={tr}
                languageName={languages[tr.lang].label}
                onChange={newTr => this.handleChange(newTr, key)}
                onDelete={() => this.handleDelete(key)}
                onMakeDefault={() => this.handleMakeDefault(key)}
              />
            </Grid>
          )}
        </Grid>
      </React.Fragment>
    );
  }
}

TranslationPicker.propTypes = {
  languages: PropTypes.objectOf(PropTypes.object),
  translations: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(TranslationPicker);
