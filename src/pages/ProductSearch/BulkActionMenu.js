import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Icon from "@material-ui/core/es/Icon/Icon";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";

const styles = theme => ({});

class BulkActionMenu extends React.PureComponent {
  handleDisableClick = () => {
    if (!window.confirm("Êtes-vous sûr de vouloir désactiver tous les produits sélectionnées?")) {
      return;
    }

    this.props.onDisable();
  }

  render() {
    return (
      <div>
        <Tooltip title="Désactiver" placement="top">
          <IconButton onClick={() => this.handleDisableClick()}>
            <Icon>highlight_off</Icon>
          </IconButton>
        </Tooltip>

        <IconButton>
          <Icon>more_horiz</Icon>
        </IconButton>
      </div>
    );
  }
}

BulkActionMenu.propTypes = {
  onDisable: PropTypes.func.isRequired
};

export default withStyles(styles)(BulkActionMenu);
