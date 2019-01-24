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
import {signIn} from "../../shared/index";
import Alert from "../../shared/Alert";
import Link from "react-router-dom/es/Link";
import LoginLayout from "../../layout/LoginLayout";

const styles = theme => ({
  section: {
    marginTop: theme.spacing.unit * 3,
  },
  pageTitle: {
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
  loadingButton: {...theme.buttonProgress},
  usernameInput: {
    marginBottom: theme.spacing.unit * 2,
  },
  adornment: {
    color: theme.colors.disabled
  },
});

const i18n = {
  pageTitle: "Se Connecter",
  username: "Nom d'utilisateur",
  usernameExample: "Ex: nom@domaine.com",
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
            password: {value: "", isPristine: true},
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
    const {classes} = this.props;
    const hasUsernameError = username.value.trim() === "" && !username.isPristine;
    const hasPasswordError = password.value.trim() === "" && !password.isPristine;
    const isFormComplete = username.value !== "" && password.value !== "";

    return (
      <LoginLayout>
        <div className={classes.section}>
          <Typography variant="h5" className={classes.pageTitle}>{i18n.pageTitle}</Typography>
          {error && <Alert title={i18n.errorTitle} description={i18n.errorMessage} type="error"/>}
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
            placeholder={i18n.usernameExample}
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
                  <Icon>vpn_key</Icon>
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
          <Button component={Link} to="/forgot-password" className={classes.forgotPasswordButton}>{i18n.forgotPassword}</Button>
        </div>
      </LoginLayout>
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

