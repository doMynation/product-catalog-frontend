import React, {Component} from 'react';
import PropTypes from 'prop-types'

class StorePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStore: "",
      selectedStorePrice: "",
      selectedStorePriceError: "",
    };
  }

  handleSelection = (e) => {
    this.setState({selectedStore: e.target.value});
  }

  checkEnterPressed = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (this.isValid()) {
        this.handleAdd();
      }
    }
  }

  handleSetStorePrice = (e) => {
    const price = parseFloat(e.target.value);
    const error = isNaN(price) ? "Prix invalide" : "";

    this.setState({
      selectedStorePrice: e.target.value,
      selectedStorePriceError: error
    });
  }

  isValid = () => this.state.selectedStore !== "" && this.state.selectedStorePriceError === ""

  handleAdd = () => {
    // Validation
    const store = this.props.stores.find(store => store.id == this.state.selectedStore);

    if (store === undefined) {
      alert("Erreur");
      return;
    }

    this.props.handleAdd(store, parseFloat(this.state.selectedStorePrice));

    this.setState({selectedStore: "", selectedStorePrice: ""});
  }

  render() {
    return (
      <div>
        <h1>Disponibilités</h1>
        <p>Some help text here ...</p>
        <select onChange={this.handleSelection} value={this.state.selectedStore}>
          <option value="">Choisir ...</option>
          {this.props.stores.map(store =>
            <option key={'store_' + store.id} value={store.id}>{store.name}</option>
          )}
        </select>

        <input type="text" value={this.state.selectedStorePrice} onChange={this.handleSetStorePrice} onKeyPress={this.checkEnterPressed}/>

        <button type="button" onClick={this.handleAdd} disabled={!this.isValid()}>
          <i className="fas fa-plus"></i>
          Add
        </button>

        {
          this.state.selectedStorePriceError === "" ? '' :
            <span className="input-error"><i className="fas fa-exclamation-triangle"></i> {this.state.selectedStorePriceError}</span>
        }

        {this.renderAddedStores()}
      </div>
    );
  }

  renderAddedStores() {
    return (
      <table>
        <thead>
        <tr>
          <td>Entité</td>
          <td>Prix</td>
        </tr>
        </thead>
        <tbody>
        {this.props.addedStores.map((addedStore, idx) => (
          <tr key={'added-store-' + idx}>
            <td>{addedStore.store.name}</td>
            <td>{addedStore.price}</td>
            <td>
              <button type="button" onClick={this.props.handleDelete}><i className="fas fa-trash"></i></button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    );
  }
}

StorePicker.propTypes = {
  stores: PropTypes.array.isRequired,
  addedStores: PropTypes.array.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
}

export default StorePicker;
