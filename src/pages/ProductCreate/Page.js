import React, {Component} from 'react';
import withStyles from "@material-ui/core/es/styles/withStyles";
import PageHeader from "../../layout/PageHeader";
import Grid from "@material-ui/core/es/Grid/Grid";
import Paper from "@material-ui/core/es/Paper/Paper";
import Layout from "../../layout/Layout";

const styles = theme => ({
  root: {
    ...theme.layout.pageContainer
  }
});

class Page extends Component {

  render() {
    const {classes} = this.props;

    return (
      <Layout>
        <div className={classes.root}>
          <PageHeader>Créer un nouveau produit</PageHeader>

          <Grid container className={classes.layout} spacing={16}>
            <Grid item xs={12} md={2} lg={2}>
              <Paper elevation={8}>
                Left side
              </Paper>
            </Grid>

            <Grid item xs={12} md={10} lg={10}>
              <Paper elevation={8}>
                Right side
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Layout>
    );
  }
}

Page.propTypes = {};

export default withStyles(styles)(Page);
