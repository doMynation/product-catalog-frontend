import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Button from "@material-ui/core/es/Button/Button";
import Window from "../Window";
import ListItem from "@material-ui/core/es/ListItem/ListItem";
import List from "@material-ui/core/es/List/List";
import ListItemSecondaryAction from "@material-ui/core/es/ListItemSecondaryAction/ListItemSecondaryAction";
import Icon from "@material-ui/core/es/Icon/Icon";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import Fab from "@material-ui/core/es/Fab/Fab";
import DepartmentCreator from "./DepartmentCreator";

const styles = theme => ({});
const i18n = {
  titleSelect: "Départements",
  titleCreate: "Créer un département",
};

class DepartmentPicker extends Component {
  state = {
    isOpen: true,
    isCreating: false,
  };

  handleCreate = dept => {
    // update cache
    this.setState({isCreating: false});

    this.props.onSelect(dept);
  }

  handleSelect = key => {
    this.setState({isOpen: false});

    this.props.onSelect(this.props.departments[key]);
  };

  render() {
    const {selectedDepartmentId, departments} = this.props;
    const {isOpen, isCreating} = this.state;
    const selectedDepartment = departments[selectedDepartmentId];
    const title = isCreating ? (
      <div>
        <IconButton onClick={() => this.setState({isCreating: false})}>
          <Icon>arrow_back</Icon>
        </IconButton>
        {i18n.titleCreate}
      </div>
    ) : i18n.titleSelect;

    return (
      <div>
        <Button onClick={() => this.setState({isOpen: true})}>{selectedDepartment.description.name}</Button>

        <Window
          title={title}
          description={'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur at, delectus doloribus ea enim, eos ex fugiat ipsum natus nemo nulla possimus provident, quae quod quos sunt? Corporis, vero.'}
          isOpen={isOpen}
          onClose={() => this.setState({isOpen: false})}
          withButtons={false}
        >
          {isCreating ? (
            <div>
              <DepartmentCreator
                onSubmit={this.handleCreate}
              />
            </div>
          ) : (
            this.renderList(departments, selectedDepartment)
          )}
        </Window>
      </div>
    );
  }

  renderList = (departments, selectedDepartment) => {
    return (
      <List dense={true}>
        {Object.entries(departments).map(([key, department]) => this.renderDepartment(department, key, department.id === selectedDepartment.id))}
        <ListItem>
          <Fab size="small" color="primary" onClick={() => this.setState({isCreating: true})}>
            <Icon>add</Icon>
          </Fab>
        </ListItem>
      </List>
    );
  }

  renderDepartment = (department, key, isSelected) => {
    return (
      <ListItem key={`dep_${key}`} button selected={isSelected} onClick={() => this.handleSelect(key)}>
        <ListItemText
          primary={department.description.name}
          secondary={department.description.shortDescription ? department.description.shortDescription : null}
        />
        <ListItemSecondaryAction>
          <IconButton aria-label="Supprimer">
            <Icon>edit</Icon>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

DepartmentPicker.propTypes = {
  selectedDepartmentId: PropTypes.number.isRequired,
  departments: PropTypes.objectOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default withStyles(styles)(DepartmentPicker);
