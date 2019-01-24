import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Layout from "./Layout";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import Grid from "@material-ui/core/es/Grid/Grid";
import Typography from "@material-ui/core/es/Typography/Typography";
import Logo from '../logo.png'

const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
  },
  section: {
    marginTop: theme.spacing.unit * 3,
  },
  leftSide: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    padding: theme.spacing.unit * 3,
    textAlign: 'center',
  },
  leftSideInner: {
    width: '100%',
    padding: theme.spacing.unit * 2,
  },
  leftTitle: {
    textTransform: 'uppercase',
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center',
    color: '#fbfbfb',
  },
  rightSideInner: {
    textAlign: 'center',
    width: '100%',
    paddingBottom: theme.spacing.unit * 3,
  },
  rightSideText: {
    textAlign: 'left',
    color: '#fbfbfb',
    margin: '0 auto',
    width: '50%',
  },
  rightSideBody: {
    textAlign: 'justify',
  },
  logo: {
    marginTop: -20,
    marginBottom: -20,
  },
});

const i18n = {
  rightTitle: "Bienvenue",
  rightBody: "InvTory est un outil de gestion d'inventaire et de planification des resources de production. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam animi asperiores eaque fuga illo mollitia porro ratione sed voluptatem. Architecto delectus deleniti dignissimos laborum modi praesentium sequi sunt veniam voluptatum.",
};

const renderRightSide = classes => {
  return (
    <div className={classes.rightSideInner}>
      <img src={Logo} alt="Inventarius" className={classes.logo}/>

      <div className={classes.rightSideText}>
        <Typography variant="h4" color="inherit">{i18n.rightTitle}</Typography>
        <Typography color="inherit" className={classes.rightSideBody}>{i18n.rightBody}</Typography>
      </div>
    </div>
  );
}

const LoginLayout = ({classes, children}) => (
  <Layout showHeader={false} showMenu={false}>
    <Hidden mdUp>
      {renderRightSide(classes)}
    </Hidden>

    <Grid container className={classes.root}>
      <Grid item className={classes.leftSide} xs={12} md={4}>
        <div className={classes.leftSideInner}>
          {children}
        </div>
      </Grid>

      <Hidden smDown>
        <Grid item className={classes.rightSide} xs={12} md={8}>
          {renderRightSide(classes)}
        </Grid>
      </Hidden>
    </Grid>
  </Layout>
);

LoginLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withStyles(styles)(LoginLayout);
