import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Grid from "@material-ui/core/es/Grid/Grid";
import Header from "./Header";
import Menu from "./Menu";
import Notification from "../shared/Notification";
import BgImage from './images/dark-material-bg.jpg';

const styles = theme => ({
  root: {
    height: '100%',
    flexWrap: 'nowrap',
    backgroundImage: `url(${BgImage})`,
    backgroundSize: 'cover',
  },
  content: {
    flexGrow: 1,
  }
});

const Layout = ({classes, showMenu = true, showHeader = true, children}) => (
  <Grid container direction="column" className={classes.root}>
    <Grid item>
      {showHeader && <Header/>}
      {showMenu && <Menu/>}

      <Notification/>
    </Grid>

    <Grid container className={classes.content}>
      {children}
    </Grid>
  </Grid>
);

Layout.propTypes = {
  showMenu: PropTypes.bool,
  showHeader: PropTypes.bool,
};

export default withStyles(styles)(Layout);
