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
import Button from "@material-ui/core/es/Button/Button";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import connect from "react-redux/es/connect/connect";
import {applyFilters, toggleAdvancedFilters} from "./actions";
import AdvancedSearchFiltersDialog from "./AdvancedSearchFiltersDialog";

const styles = theme => ({
  root: {},
  filterIcon: {
    backgroundColor: "white",
    color: "black"
  },
  advancedFiltersButton: {
    float: 'right'
  }
});

class TableFilters extends React.PureComponent {
  state = {
    id: "",
    sku: "",
    name: "",
    category: "",
    department: "",
  };

  timer = null;

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.id !== prevProps.id) {
      this.setState({
        id: this.props.id,
        sku: this.props.sku,
        name: this.props.name,
        category: this.props.category,
        department: this.props.department,
      });
    }
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

  handleAdvancedFiltersChange = advancedFilters => {
    const newFilters = {...this.state.filters, ...advancedFilters};

    console.log(newFilters);
    this.props.emit(newFilters);
  }


  render() {
    const {classes, handleAdvancedFiltersClick} = this.props;

    return (
      <div>
        <AdvancedSearchFiltersDialog
          onSubmit={this.handleAdvancedFiltersChange}
        />
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

            <FormControl>
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

            <FormControl>
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
            <Tooltip title="Filtres avancés" placement="right">
              <Button variant="fab" mini onClick={handleAdvancedFiltersClick} className={classes.advancedFiltersButton}>
                <Icon>more_vert</Icon>
              </Button>
            </Tooltip>
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
};

const mstp = state => {
  const filters = state.productSearch.search.filters;

  return {
    id: filters.id,
    sku: filters.sku,
    name: filters.name,
    category: filters.name,
    department: filters.name
  };
}

const mdtp = dispatch => ({
  handleAdvancedFiltersClick: () => dispatch(toggleAdvancedFilters(true)),
  emit: state => dispatch(applyFilters(state))
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(TableFilters);
