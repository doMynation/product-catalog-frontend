import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {filterObj, firstKey} from "../../util/functions";

class TranslationsTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLanguageId: Object.keys(props.languages)[0],
      availableLanguages: props.languages
    };
  }

  componentWillReceiveProps(props) {
    const filteredLanguages = filterObj(props.languages, (value, key) => {
      return !props.translations.some(translation => translation.lang === key);
    })

    const nextLanguage = firstKey(filteredLanguages)

    this.setState({
      availableLanguages: filteredLanguages,
      selectedLanguageId: nextLanguage === undefined ? "" : nextLanguage
    });
  }

  handleChange = (e, fieldName, idx) => {
    const value = e.target.value;

    if (this.props.translations[idx] === undefined) {
      return;
    }

    // Update the translation item
    const items = [...this.props.translations];
    items[idx] = {
      ...items[idx],
      [fieldName]: value
    };

    this.props.onEdit(items);
  }

  handleAdd = () => {
    const idx = this.state.availableLanguages.findIndex(lang => lang.id === this.state.selectedLanguageId)

    if (idx === -1) {
      return;
    }

    const newTranslation = {
      language: this.state.availableLanguages[idx],
      name: "",
      shortDescription: "",
      longDescription: "",
    }

    this.props.onAdd(newTranslation);
  }

  handleSelectLanguage = (e) => {
    this.setState({selectedLanguageId: e.target.value});
  }

  render() {
    const {availableLanguages, selectedLanguageId} = this.state;

    return (
      <div>
        <h1>Traductions</h1>
        <p>
          Pour traduire ce produit, ajouter une langue à l'aide du formulaire ici-bas.
        </p>

        <div>
          <label htmlFor="lang"></label>

          <select name="lang" id="lang" onChange={this.handleSelectLanguage} value={selectedLanguageId}>
            {Object.keys(availableLanguages).map(key => (
              <option key={'lang_' + key} value={key}>{availableLanguages[key]}</option>
            ))}
          </select>

          <button type="button" onClick={this.handleAdd} disabled={selectedLanguageId === ""}>
            <i className="fas fa-plus"></i></button>

          <table>
            <thead>
            <tr>
              <th>Nom</th>
              <th>Description (Courte)</th>
              <th>Description (Longue)</th>
            </tr>
            </thead>
            <tbody>
            {this.props.translations.map((translation, idx) => this.renderTranslation(idx, translation))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  renderTranslation = (idx, translation) => {
    const langName = this.props.languages[translation.lang];
    const description = translation.description;

    return (
      <tr key={'translation_' + idx}>
        <td>{langName}</td>

        <td>
          <input type="text" value={description.name} onChange={(e) => this.handleChange(e, "name", idx)}/>
        </td>
        <td>
          <textarea value={description.shortDescription} onChange={(e) => this.handleChange(e, "shortDescription", idx)}/>
        </td>
        <td>
          <textarea value={description.longDescription} onChange={(e) => this.handleChange(e, "longDescription", idx)}/>
        </td>
        <td>
          <button type="button" onClick={e => this.props.onDelete(idx)}><i className="fas fa-trash"></i></button>
        </td>
      </tr>
    );
  }
}

TranslationsTab.propTypes = {
  languages: PropTypes.object.isRequired,
  translations: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TranslationsTab;
