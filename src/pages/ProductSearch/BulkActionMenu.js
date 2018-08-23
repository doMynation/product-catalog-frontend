import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Icon from "@material-ui/core/es/Icon/Icon";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
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

  handleDisableClick = () => {
    this.setState({anchorEl: null});

    if (!window.confirm("Êtes-vous sûr de vouloir désactiver tous les produits sélectionnées?")) {
      return;
    }

    this.props.onDisable();
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
          <MenuItem onClick={this.handleDisableClick}>
            <ListItemIcon><Icon>delete</Icon></ListItemIcon>
            <ListItemText>Désactiver</ListItemText>
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

BulkActionMenu.propTypes = {
  onDisable: PropTypes.func.isRequired
};

export default withStyles(styles)(BulkActionMenu);
