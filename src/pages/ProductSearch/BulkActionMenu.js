import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Icon from "@material-ui/core/es/Icon/Icon";
import Grow from "@material-ui/core/es/Grow/Grow";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";

const styles = theme => ({
  button: {
    color: 'white'
  }
});

class BulkActionMenu extends React.Component {
  handleEnable = () => {
    if (!window.confirm("Êtes-vous sûr de vouloir réactiver tous les produits sélectionnées?")) {
      return;
    }

    this.props.onEnable();
  }

  handleDisable = () => {
    if (!window.confirm("Êtes-vous sûr de vouloir désactiver tous les produits sélectionnées?")) {
      return;
    }

    this.props.onDisable();
  }

  handleAttributeAdd = () => {
    this.props.onAttributeAdd();
  }

  render() {
    const {classes} = this.props;

    return (
      <div>
        <Grow timeout={300} in={true}>
          <span>
          <Tooltip title="Réactiver">
            <IconButton onClick={this.handleEnable} className={classes.button}>
              <Icon>restore_from_trash</Icon>
            </IconButton>
          </Tooltip>
          </span>
        </Grow>

        <Grow timeout={800} in={true}>
          <span>
            <Tooltip title="Désactiver">
              <IconButton onClick={this.handleDisable} className={classes.button}>
                <Icon>delete</Icon>
              </IconButton>
            </Tooltip>
          </span>
        </Grow>

        <Grow timeout={1000} in={true}>
          <span>
          <Tooltip title="Ajouter des attributs">
            <IconButton onClick={this.handleAttributeAdd} className={classes.button}>
              <Icon>playlist_add</Icon>
            </IconButton>
          </Tooltip>
          </span>
        </Grow>
      </div>
    );
  }
}

BulkActionMenu.propTypes = {
  onEnable: PropTypes.func.isRequired,
  onDisable: PropTypes.func.isRequired,
  onAttributeAdd: PropTypes.func.isRequired
};

export default withStyles(styles)(BulkActionMenu);
