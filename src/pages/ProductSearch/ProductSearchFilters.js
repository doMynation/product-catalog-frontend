import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import AdvancedSearchFiltersDialog from "./AdvancedSearchFiltersDialog";
import TableCell from "@material-ui/core/es/TableCell/TableCell";
import TableRow from "@material-ui/core/es/TableRow/TableRow";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Icon from "@material-ui/core/es/Icon/Icon";
import TextField from "@material-ui/core/es/TextField/TextField";
import FormControl from "@material-ui/core/es/FormControl/FormControl";
import InputLabel from "@material-ui/core/es/InputLabel/InputLabel";
import Select from "@material-ui/core/es/Select/Select";
import MenuItem from "@material-ui/core/es/MenuItem/MenuItem";
import debounce from 'lodash.debounce'

const styles = theme => ({});

class ProductSearchFilters extends Component {
  static getDerivedStateFromProps(props, current_state) {
    if (current_state.filters !== props.filters) {
      return {
        filters: props.filters
      };
    }

    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      isAdvancedFiltersDialogOpen: false,
      filters: props.filters
    };
  }

  handleAdvancedFiltersChange = (advancedFilters) => {
    const newFilters = Object.assign({}, this.state, advancedFilters);
    console.log("COMPARING ADV FILTERS", newFilters, {...this.state, advancedFilters});
  }

  handleFilterChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      filters: {
        ...this.state.filters,
        [name]: value
      }
    }, () => {
      this.emitChange();
    });
  }

  // Debounced text change
  emitChange = debounce(() => {
    this.props.onChange(this.state.filters);
  }, 400)

  render() {
    const filters = this.state.filters;

    return (
      <TableRow>
        <TableCell>
          <AdvancedSearchFiltersDialog
            open={this.state.isAdvancedFiltersDialogOpen}
            onCancel={() => this.setState({isAdvancedFiltersDialogOpen: false})}
            onSubmit={this.handleAdvancedFiltersChange}
          />

          <Tooltip title="Filtres avancés">
            <IconButton onClick={() => this.setState({isAdvancedFiltersDialogOpen: true})}>
              <Icon>filter_list</Icon>
            </IconButton>
          </Tooltip>

          <TextField
            id="id"
            label="ID"
            name="id"
            value={filters.id || ""}
            onChange={this.handleFilterChange}
          />
        </TableCell>

        <TableCell>
          <FormControl>
            <InputLabel htmlFor="input-category">Catégorie</InputLabel>
            <Select
              style={{width: 120}}
              value={filters.category || ""}
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
              style={{width: 120}}
              value={filters.department || ""}
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
        </TableCell>
        <TableCell>
          <TextField
            id="sku"
            label="SKU"
            name="sku"
            value={filters.sku || ""}
            onChange={this.handleFilterChange}
          />
        </TableCell>
        <TableCell>
          <TextField
            id="name"
            label="Nom"
            name="name"
            value={filters.name || ""}
            onChange={this.handleFilterChange}
          />
        </TableCell>
        <TableCell>{' '}</TableCell>
        <TableCell>{' '}</TableCell>
      </TableRow>
    );
  }
}

ProductSearchFilters.propTypes = {
  onChange: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  departments: PropTypes.array.isRequired,
};

export default withStyles(styles)(ProductSearchFilters);
