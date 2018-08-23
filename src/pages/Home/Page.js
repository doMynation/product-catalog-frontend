import React from 'react';
import Typography from "@material-ui/core/es/Typography/Typography";
import Paper from "@material-ui/core/es/Paper/Paper";
import connect from "react-redux/es/connect/connect";
import {openMenu} from "../../shared/index";
import Button from "@material-ui/core/es/Button/Button";
import Icon from "@material-ui/core/es/Icon/Icon";
import compose from "redux/src/compose";
import withStyles from "@material-ui/core/es/styles/withStyles";

const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBlock: {
    padding: theme.spacing.unit * 3,
    textAlign: 'center'
  },
  icon: {
    paddingLeft: theme.spacing.unit
  }
});

const Home = ({handleClick, isMenuOpen, classes}) => (
  <div className={classes.root}>
    <Paper className={classes.whiteBlock}>
      <Typography variant="display1" color="inherit">
        Module d'Inventaire
      </Typography>

      <Typography variant="body2" color="inherit">Bienvenue dans le module d'inventaire. Ici, vous pouvez configurer les produits.</Typography>

      <br/>

      <Button size="large" color="primary" variant="raised" onClick={handleClick}>
        Commencez ici
        <Icon className={classes.icon}>send</Icon>
      </Button>
    </Paper>
  </div>
);

const mdtp = dispatch => ({
  handleClick: () => dispatch(openMenu())
});

export default compose(
  withStyles(styles),
  connect(null, mdtp)
)(Home);
