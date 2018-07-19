import React from 'react';
import PropTypes from 'prop-types'
import Typography from "@material-ui/core/es/Typography/Typography";
import AppBar from "@material-ui/core/es/AppBar/AppBar";
import Toolbar from "@material-ui/core/es/Toolbar/Toolbar";
import Icon from "@material-ui/core/es/Icon/Icon";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import connect from "react-redux/es/connect/connect";
import {openMenu} from '../shared/index';

const Header = ({handleClick}) => (
  <AppBar position="static" color="primary">
    <Toolbar>
      <IconButton color="inherit" onClick={handleClick}><Icon>menu</Icon></IconButton>
      <Typography variant="title" color="inherit">Inventaire</Typography>
    </Toolbar>
  </AppBar>
);

Header.propTypes = {
  handleClick: PropTypes.func.isRequired
};

const mdtp = dispatch => ({
  handleClick: () => dispatch(openMenu())
});

export default connect(null, mdtp)(Header);
