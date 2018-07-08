import React from 'react';
import {compose} from 'redux';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import TextField from "@material-ui/core/es/TextField/TextField";
import CardContent from "@material-ui/core/es/CardContent/CardContent";
import CardHeader from "@material-ui/core/es/CardHeader/CardHeader";
import Card from "@material-ui/core/es/Card/Card";
import Avatar from "@material-ui/core/es/Avatar/Avatar";
import Icon from "@material-ui/core/es/Icon/Icon";
import FormControl from "@material-ui/core/es/FormControl/FormControl";
import InputLabel from "@material-ui/core/es/InputLabel/InputLabel";
import Select from "@material-ui/core/es/Select/Select";
import MenuItem from "@material-ui/core/es/MenuItem/MenuItem";
import connect from "react-redux/es/connect/connect";
import {applyFilters} from "./index";
import Switch from "@material-ui/core/es/Switch/Switch";
import FormControlLabel from "@material-ui/core/es/FormControlLabel/FormControlLabel";
import FormGroup from "@material-ui/core/es/FormGroup/FormGroup";
import FormLabel from "@material-ui/core/es/FormLabel/FormLabel";

const styles = theme => ({
  root: {},
  filterIcon: {
    backgroundColor: "white",
    color: "black"
  },
  formControl: {
    width: '100%'
  }
});

class TableFilters extends React.PureComponent {
  state = {
    id: "",
    sku: "",
    name: "",
    category: "",
    department: "",
    isCustom: "",
    isKit: "",
    isPart: "",
  };

  timer = null;

  componentDidUpdate(prevProps, prevState, snapshot) {
    let newState = {};

    for (let key of Object.keys(this.state)) {
      if (this.props[key] !== prevProps[key]) {
        newState[key] = this.props[key];
      }
    }

    if (Object.keys(newState).length !== 0) {
      this.setState(newState);
    }
  }

  handleSwitchChange = event => {
    const name = event.target.name;
    let value = event.target.value;

    if (this.state[name] === value) {
      value = "";
    }

    this.setState({[name]: value}, () => this.props.emit(this.state));
  }

  handleFilterChange = (event, isDebounced = false) => {
    const {name, value} = event.target;

    this.setState({[name]: value}, () => {
      if (!isDebounced) {
        this.props.emit(this.state);
      } else {
        // Debounce changes emitting
        clearTimeout(this.timer);

        this.timer = setTimeout(() => {
          this.props.emit(this.state);
        }, 400);
      }
    });
  }

  render() {
    const {classes} = this.props;

    return (
      <div>
        <Card>
          <CardHeader title="Filtres" avatar={<Avatar className={classes.filterIcon}>
            <Icon>filter_list</Icon>
          </Avatar>}/>

          <CardContent>
            <TextField
              id="id"
              label="ID"
              name="id"
              value={this.state.id}
              onChange={e => this.handleFilterChange(e, true)}
            />

            <TextField
              id="sku"
              label="SKU"
              name="sku"
              value={this.state.sku}
              onChange={e => this.handleFilterChange(e, true)}
            />

            <TextField
              id="name"
              label="Nom"
              name="name"
              value={this.state.name}
              onChange={e => this.handleFilterChange(e, true)}
            />

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="input-category">Catégorie</InputLabel>
              <Select
                value={this.state.category}
                onChange={this.handleFilterChange}
                inputProps={{
                  name: 'category',
                  id: 'input-category'
                }}>
                <MenuItem value="">
                  <em>Toutes</em>
                </MenuItem>
                {this.props.categories.map((category, idx) => (
                  <MenuItem key={idx} value={category.code}>{' - '.repeat(category.depth - 1)}{category.description.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <br/>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="input-department">Département</InputLabel>
              <Select
                value={this.state.department}
                onChange={this.handleFilterChange}
                inputProps={{
                  name: 'department',
                  id: 'input-department'
                }}>
                <MenuItem value="">
                  <em>Tous</em>
                </MenuItem>
                {this.props.departments.map((department, idx) => (
                  <MenuItem key={idx} value={department.code}>{department.description.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <br/>
            <br/>

            <FormControl component="fieldset">
              <FormLabel component="legend">État du produit</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.isCustom === "0"}
                      name="isCustom"
                      value="0"
                      color="secondary"
                      onChange={this.handleSwitchChange}
                    />
                  }
                  label="Standard"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.isCustom === "1"}
                      name="isCustom"
                      value="1"
                      color="secondary"
                      onChange={this.handleSwitchChange}
                    />
                  }
                  label="Sur Mesure"
                />
              </FormGroup>
            </FormControl>

            <br/><br/>

            <FormControl component="fieldset">
              <FormLabel component="legend">Type de produit</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.isKit === "1"}
                      name="isKit"
                      value="1"
                      color="primary"
                      onChange={this.handleSwitchChange}
                    />
                  }
                  label="Kit"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.isPart === "1"}
                      name="isPart"
                      value="1"
                      color="primary"
                      onChange={this.handleSwitchChange}
                    />
                  }
                  label="Pièce"
                />
              </FormGroup>
            </FormControl>
          </CardContent>
        </Card>
      </div>
    );
  }
}

TableFilters.propTypes = {
  categories: PropTypes.array.isRequired,
  departments: PropTypes.array.isRequired,
  id: PropTypes.string,
  sku: PropTypes.string,
  name: PropTypes.string,
  category: PropTypes.string,
  department: PropTypes.string,
  isCustom: PropTypes.string,
  isKit: PropTypes.string,
  isPart: PropTypes.string,
};

const mstp = state => {
  const filters = state.productSearch.search.filters;

  return {...filters};
}

const mdtp = dispatch => ({
  emit: state => dispatch(applyFilters(state))
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(TableFilters);
