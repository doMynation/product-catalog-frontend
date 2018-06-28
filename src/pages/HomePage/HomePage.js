import React from 'react';
import Typography from "@material-ui/core/es/Typography/Typography";
import Paper from "@material-ui/core/es/Paper/Paper";
import connect from "react-redux/es/connect/connect";
import {openMenu} from "../../shared/actions";
import Button from "@material-ui/core/es/Button/Button";
import Icon from "@material-ui/core/es/Icon/Icon";
import './style.css';

const HomePage = ({handleClick, isMenuOpen}) => (
  <Paper className="paper">
    <Typography variant="display2" color="inherit">
      Module d'Inventaire
    </Typography>

    <Typography variant="headline">Bienvenue dans le module d'inventaire. Ici, vous pouvez configurer les produits.</Typography>

    <Button size="large" color="primary" variant="raised" onClick={handleClick}>
      Commencez ici
      <Icon>send</Icon>
    </Button>
  </Paper>
);

const mdtp = dispatch => ({
  handleClick: () => dispatch(openMenu())
});

export default connect(null, mdtp)(HomePage);
