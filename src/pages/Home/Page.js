import React from 'react';
import Typography from "@material-ui/core/es/Typography/Typography";
import Paper from "@material-ui/core/es/Paper/Paper";
import connect from "react-redux/es/connect/connect";
import {openMenu} from "../../shared/index";
import Button from "@material-ui/core/es/Button/Button";
import Icon from "@material-ui/core/es/Icon/Icon";
import compose from "redux/src/compose";
import withStyles from "@material-ui/core/es/styles/withStyles";
import Layout from "../../layout/Layout";

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

const Home = ({handleClick, isMenuOpen, classes, isAuthenticated}) => (
  <Layout>
    <div className={classes.root}>
      <Paper className={classes.whiteBlock}>
        <Typography variant="h4" color="inherit">
          Module d'Inventaire
        </Typography>

        <Typography variant="body1" color="inherit">Bienvenue dans le module d'inventaire. Ici, vous pouvez configurer les produits.</Typography>

        <br/>

        <Button size="large" color="primary" variant="contained" onClick={handleClick}>
          Commencez ici
          <Icon className={classes.icon}>send</Icon>
        </Button>
      </Paper>
    </div>
  </Layout>
);

const mdtp = dispatch => ({
  handleClick: () => dispatch(openMenu())
});

const mstp = ({shared}) => ({
  isAuthenticated: shared.isAuthenticated
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(Home);
