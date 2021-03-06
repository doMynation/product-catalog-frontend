import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import Drawer from "@material-ui/core/es/Drawer/Drawer";
import Icon from "@material-ui/core/es/Icon/Icon";
import List from "@material-ui/core/es/List/List";
import ListItem from "@material-ui/core/es/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/es/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import connect from "react-redux/es/connect/connect";
import {closeMenu, signOut} from "../shared/index";

const Menu = ({isOpen, onClose, signOut}) => (
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

        <ListItem button onClick={signOut}>
          <ListItemIcon><Icon>power_settings_new</Icon></ListItemIcon>
          <ListItemText primary="Quitter"/>
        </ListItem>
      </List>
    </div>
  </Drawer>
);

const mstp = ({shared}) => ({
  isOpen: shared.isMenuOpen
});

const mdtp = dispatch => ({
  onClose: () => dispatch(closeMenu()),
  signOut: () => dispatch(signOut()),
});

Menu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default connect(mstp, mdtp)(Menu);
