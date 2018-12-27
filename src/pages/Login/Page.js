import React from 'react';
import Typography from "@material-ui/core/es/Typography/Typography";
import Paper from "@material-ui/core/es/Paper/Paper";
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
  },
  loadingButton: {...theme.buttonProgress}
});

const i18n = {
  help: "Veuillez entrer votre nom d'utilisateur et votre mot de passe.",
  username: "Nom d'utilisateur",
  password: "Mot de passe",
  buttonLabel: "Connexion",
  error: "Combination de nom d'utilisateur et mot de passe invalide.",
  errorRequired: "Obligatoire",
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
            error: i18n.error,
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

    return (
      <Layout showMenu={isAuthenticated} showHeader={isAuthenticated}>
        <div className={classes.root}>
          <Paper className={classes.whiteBlock}>
            <img src={Logo} alt="Inventarius"/>
            <Typography variant="body2" color="inherit">{i18n.help}</Typography>

            {error && <Typography variant="caption" color="secondary"><Icon>error_outline</Icon> {error}</Typography>}

            <br/>
            <br/>

            <TextField
              id="username-input"
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
                  <InputAdornment position="end">
                    <Icon>account_circle</Icon>
                  </InputAdornment>
                ),
              }}
            />

            <br/>
            <br/>

            <TextField
              id="password-input"
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
                  <InputAdornment position="end">
                    <Icon>lock</Icon>
                  </InputAdornment>
                ),
              }}
            />

            <br/>
            <br/>
            <br/>

            <Button onClick={this.handleLogin} color="primary" disabled={isLoading}>
              {i18n.buttonLabel}
              <Icon>exit_to_app</Icon>

              {isLoading && <CircularProgress className={classes.loadingButton} size={20}/>}
            </Button>
          </Paper>
        </div>
      </Layout>
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

