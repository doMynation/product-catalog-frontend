import React from 'react';
import Typography from "@material-ui/core/es/Typography/Typography";
import Paper from "@material-ui/core/es/Paper/Paper";
import connect from "react-redux/es/connect/connect";
import {openMenu} from "../../shared/index";
import Button from "@material-ui/core/es/Button/Button";
import Icon from "@material-ui/core/es/Icon/Icon";
import './style.css';
import compose from "redux/src/compose";
import withStyles from "@material-ui/core/es/styles/withStyles";

const styles = theme => ({});

const Home = ({handleClick, isMenuOpen}) => (
  <Paper className="paper">
    <Typography variant="display2" color="inherit">
      Module d'Inventaire
    </Typography>

    <Typography variant="headline" color="inherit">Bienvenue dans le module d'inventaire. Ici, vous pouvez configurer les produits.</Typography>

    <br/>
    <br/>

    <Button size="large" color="primary" variant="raised" onClick={handleClick}>
      Commencez ici
      <Icon>send</Icon>
    </Button>
  </Paper>
);

const mdtp = dispatch => ({
  handleClick: () => dispatch(openMenu())
});

export default compose(
  withStyles(styles),
  connect(null, mdtp)
)(Home);
