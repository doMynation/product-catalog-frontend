import React from 'react';
import Typography from "@material-ui/core/es/Typography/Typography";
import connect from "react-redux/es/connect/connect";
import Button from "@material-ui/core/es/Button/Button";
import Icon from "@material-ui/core/es/Icon/Icon";
import compose from "redux/src/compose";
import withStyles from "@material-ui/core/es/styles/withStyles";
import TextField from "@material-ui/core/es/TextField/TextField";
import InputAdornment from "@material-ui/core/es/InputAdornment/InputAdornment";
import Api from "../../util/Api";
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";
import Logo from '../../logo.png'
import {signIn} from "../../shared/index";
import Layout from "../../layout/Layout";
import Alert from "../../shared/Alert";
import Grid from "@material-ui/core/es/Grid/Grid";
import Hidden from "@material-ui/core/es/Hidden/Hidden";

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
  forgotPasswordContainer: {
    textAlign: 'center',
    marginTop: theme.spacing.unit,
  },
  forgotPasswordButton: {
    color: 'blue',
    fontSize: 10
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
  loadingButton: {...theme.buttonProgress},
  usernameInput: {
    marginBottom: theme.spacing.unit * 2,
  },
  adornment: {
    color: theme.colors.disabled
  },
});

const i18n = {
  leftTitle: "Se Connecter",
  rightTitle: "Bienvenue dans Inventarius",
  rightBody: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad commodi consequuntur fugit minus non qui reprehenderit saepe voluptate. Aspernatur blanditiis corporis, esse facilis impedit nisi quis reprehenderit similique voluptates voluptatibus.",
  help: "Veuillez entrer votre nom d'utilisateur et votre mot de passe.",
  username: "Nom d'utilisateur",
  password: "Mot de passe",
  buttonLabel: "Connexion",
  errorTitle: "Erreur",
  errorMessage: "Combination de nom d'utilisateur et mot de passe invalide.",
  errorRequired: "Obligatoire",
  forgotPassword: "J'ai oublié mon mot de passe",
};

class Page extends React.Component {
  state = {
    isLoading: false,
    error: "",
    username: {
      isPristine: true,
      value: ""
    },
    password: {
      isPristine: true,
      value: ""
    },
  };

  handleLogin = () => {
    const username = this.state.username.value.trim();
    const password = this.state.password.value.trim();

    if (username === "" || password === "") {
      return;
    }

    this.setState({isLoading: true});

    setTimeout(() => {
      Api
        .login(username, password)
        .then(resp => {
          this.props.signIn(resp.data);
        })
        .catch(err => {
          this.setState({
            isLoading: false,
            password: {value: "", isPristine: false},
            error: i18n.errorMessage,
          });
        })
    }, 1000);
  }

  handleKeyPress = e => {
    if (e.key === 'Enter' && !this.state.isLoading) {
      this.handleLogin();
    }
  }

  render() {
    const {username, password, isLoading, error} = this.state;
    const {classes, isAuthenticated} = this.props;
    const hasUsernameError = username.value.trim() === "" && !username.isPristine;
    const hasPasswordError = password.value.trim() === "" && !password.isPristine;
    const isFormComplete = username.value !== "" && password.value !== "";

    return (
      <Layout showMenu={isAuthenticated} showHeader={isAuthenticated}>
        <Hidden mdUp>
          {this.renderRightSide()}
        </Hidden>

        <Grid container className={classes.root}>
          <Grid item className={classes.leftSide} xs={12} md={4}>
            <div className={classes.leftSideInner}>
              <div className={classes.section}>
                <Typography variant="h5" className={classes.leftTitle}>{i18n.leftTitle}</Typography>

                {error && <Alert title={i18n.errorTitle} description={i18n.errorMessage}/>}
              </div>

              <div className={classes.section}>
                <TextField
                  className={classes.usernameInput}
                  fullWidth
                  id="username-input"
                  variant="outlined"
                  label={i18n.username}
                  value={username.value}
                  onChange={e => this.setState({
                    username: {value: e.target.value, isPristine: false}
                  })}
                  onKeyPress={this.handleKeyPress}
                  error={hasUsernameError}
                  helperText={hasUsernameError ? i18n.errorRequired : ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" className={classes.adornment}>
                        <Icon>account_circle</Icon>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  id="password-input"
                  variant="outlined"
                  type="password"
                  value={password.value}
                  onKeyPress={this.handleKeyPress}
                  onChange={e => this.setState({
                    password: {value: e.target.value, isPristine: false}
                  })}
                  label={i18n.password}
                  error={hasPasswordError}
                  helperText={hasPasswordError ? i18n.errorRequired : ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" className={classes.adornment}>
                        <Icon>lock</Icon>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className={classes.section}>
                <Button fullWidth onClick={this.handleLogin} color="primary" disabled={isLoading || !isFormComplete} variant="contained">
                  {i18n.buttonLabel}
                  <Icon>exit_to_app</Icon>

                  {isLoading && <CircularProgress className={classes.loadingButton} size={20}/>}
                </Button>
              </div>

              <div className={classes.forgotPasswordContainer}>
                <Button onClick={() => console.log('clicked')} className={classes.forgotPasswordButton}>{i18n.forgotPassword}</Button>
              </div>
            </div>
          </Grid>

          <Hidden smDown>
            <Grid item className={classes.rightSide} xs={12} md={8}>
              {this.renderRightSide()}
            </Grid>
          </Hidden>
        </Grid>
      </Layout>
    );
  }

  renderRightSide = () => {
    const {classes} = this.props;

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
}

const mdtp = dispatch => ({
  signIn: user => dispatch(signIn(user))
});

const mstp = ({shared}) => ({
  isAuthenticated: shared.isAuthenticated
});

export default compose(
  withStyles(styles),
  connect(mstp, mdtp)
)(Page);

