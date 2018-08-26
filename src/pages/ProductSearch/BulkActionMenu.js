import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Icon from "@material-ui/core/es/Icon/Icon";
import MenuItem from "@material-ui/core/es/MenuItem/MenuItem";
import ListItemIcon from "@material-ui/core/es/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import Menu from "@material-ui/core/es/Menu/Menu";

const styles = theme => ({});

class BulkActionMenu extends React.Component {
  state = {
    anchorEl: null
  };

  handleMore = event => {
    this.setState({anchorEl: event.currentTarget});
  }

  handleClose = () => {
    this.setState({anchorEl: null});
  }

  handleEnable = () => {
    this.setState({anchorEl: null});

    if (!window.confirm("Êtes-vous sûr de vouloir re-activer tous les produits sélectionnées?")) {
      return;
    }

    this.props.onEnable();
  }

  handleDisable = () => {
    this.setState({anchorEl: null});

    if (!window.confirm("Êtes-vous sûr de vouloir désactiver tous les produits sélectionnées?")) {
      return;
    }

    this.props.onDisable();
  }

  handleAttributeAdd = () => {
    this.setState({anchorEl: null});

    this.props.onAttributeAdd();
  }

  render() {
    return (
      <React.Fragment>
        <IconButton onClick={this.handleMore}>
          <Icon>more_vert</Icon>
        </IconButton>

        <Menu
          id={'bulk-more-button'}
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleEnable}>
            <ListItemIcon><Icon>restore_from_trash</Icon></ListItemIcon>
            <ListItemText>Activer</ListItemText>
          </MenuItem>

          <MenuItem onClick={this.handleDisable}>
            <ListItemIcon><Icon>delete</Icon></ListItemIcon>
            <ListItemText>Désactiver</ListItemText>
          </MenuItem>

          <MenuItem onClick={this.handleAttributeAdd}>
            <ListItemIcon><Icon>playlist_add</Icon></ListItemIcon>
            <ListItemText>Ajouter un attribut</ListItemText>
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

BulkActionMenu.propTypes = {
  onEnable: PropTypes.func.isRequired,
  onDisable: PropTypes.func.isRequired,
  onAttributeAdd: PropTypes.func.isRequired
};

export default withStyles(styles)(BulkActionMenu);
