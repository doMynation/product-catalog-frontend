import React from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from "react-router-dom";
import Drawer from "@material-ui/core/es/Drawer/Drawer";
import Icon from "@material-ui/core/es/Icon/Icon";
import List from "@material-ui/core/es/List/List";
import ListItem from "@material-ui/core/es/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/es/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import connect from "react-redux/es/connect/connect";
import {closeMenu} from "../shared/index";
import Session from "../util/Session";
import {compose} from "redux";

class Menu extends React.Component {
  handleSignOut = () => {
    Session.signOut();

    this.props.history.push("/login");
  }

  render() {
    const {isOpen, onClose} = this.props;

    return (
      <Drawer open={isOpen} onClose={onClose}>
        <div
          tabIndex={0}
          role="button"
          onClick={onClose}
        >
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon><Icon>home</Icon></ListItemIcon>
              <ListItemText primary="Accueil"/>
            </ListItem>

            <ListItem button component={Link} to="/products">
              <ListItemIcon><Icon>search</Icon></ListItemIcon>
              <ListItemText primary="Produits"/>
            </ListItem>

            <ListItem button component={Link} to="/create-product">
              <ListItemIcon><Icon>add</Icon></ListItemIcon>
              <ListItemText primary="Créer un produit"/>
            </ListItem>

            <ListItem button onClick={this.handleSignOut}>
              <ListItemIcon><Icon>power_settings_new</Icon></ListItemIcon>
              <ListItemText primary="Quitter"/>
            </ListItem>
          </List>
        </div>
      </Drawer>
    );
  }
}

const mstp = state => ({
  isOpen: state.shared.isMenuOpen
});

const mdtp = dispatch => ({
  onClose: () => dispatch(closeMenu())
});

Menu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default compose(
  connect(mstp, mdtp),
  withRouter
)(Menu);
