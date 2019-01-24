import React, {Component} from 'react';
import withStyles from "@material-ui/core/es/styles/withStyles";
import LoginLayout from "../../layout/LoginLayout";
import Typography from "@material-ui/core/es/Typography/Typography";
import Alert from "../../shared/Alert";
import TextField from "@material-ui/core/es/TextField/TextField";
import Icon from "@material-ui/core/es/Icon/Icon";
import InputAdornment from "@material-ui/core/es/InputAdornment/InputAdornment";
import LoadingButton from "../../shared/LoadingButton";
import Button from "@material-ui/core/es/Button/Button";
import Link from "react-router-dom/es/Link";
import {validatePassword} from "../../util/validators";
import queryString from "query-string";
import Api from "../../util/Api";
import Loading from "../../shared/Loading";

const styles = theme => ({
  pageTitle: {
    textTransform: 'uppercase',
    fontSize: 21,
    letterSpacing: 1,
  },
  adornment: {
    color: theme.colors.disabled
  },
  section: {
    marginTop: theme.spacing.unit * 3,
  },
  goBackLink: {
    marginTop: theme.spacing.unit,
    color: 'blue',
    fontSize: 10
  },
  passwordInput: {
    marginBottom: theme.spacing.unit
  }
});

const i18n = {
  pageTitle: "Définir un nouveau mot de passe",
  help: <span>Votre mot de passe doit contenir au minimum <strong>8 caractères</strong>, dont une <strong>lettre minuscule</strong>, une <strong>lettre majuscule</strong>, un <strong>chiffre</strong> ainsi qu'<strong>un symbol</strong>.</span>,
  successTitle: "Succès!",
  successMessage: "Votre mot de passe a été changé avec succès. Vous pouvez maintenant retourner à la page de connexion et vous identifier.",
  passwordLabel: "Nouveau mot de passe",
  passwordPlaceholder: "Ex: IsaacNewt0n!",
  passwordConfirmLabel: "Confirmez le nouveau mot de passe",
  error: {
    passwordPolicy: "Le mot de passe n'est pas suffisamment fort.",
    passwordMatch: "Les mots de passe ne correspondent pas.",
    required: "Obligatoire",
  },
  submitButtonLabel: "Soumettre",
  goBackLink: "Se connecter",
  tokenInvalidTitle: "Jeton non valide",
  tokenInvalidMessage: "Ce jeton de réinitialisation de mot de passe n'est pas valide.",
};

class ChangePasswordPage extends Component {
  state = {
    isValidating: true,
    isTokenValid: false,
    token: "",
    isLoading: false,
    isSuccess: false,
    password: {
      value: "",
      isPristine: true
    },
    passwordConfirm: {
      value: "",
      isPristine: true
    },
  };

  componentDidMount() {
    setTimeout(() => {
      const params = queryString.parse(this.props.location.search);

      if (params.token === undefined || params.token.trim() === "") {
        this.setState({isTokenValid: false, isValidating: false});
        return;
      }

      // Validate token
      Api
        .validatePasswordResetToken(params.token)
        .then(data => {
          this.setState({isValidating: false, isTokenValid: true, token: params.token});
        })
        .catch(err => {
          this.setState({isValidating: false, isTokenValid: false});
        });
    }, 2000);
  }

  handleClick = () => {
    this.setState({isLoading: true});

    setTimeout(() => {
      Api
        .changePassword(this.state.token, this.state.password.value, this.state.passwordConfirm.value)
        .then(resp => {
          this.setState({isLoading: false, isSuccess: true});
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.setState({isLoading: false, isTokenValid: false});
          } else {
            // @todo: Add generic error (e.g. "Invalid request")
            this.setState(state => ({
              isLoading: false,
            }));
          }
        });
    }, 2000);
  }

  checkPassword = () => {
    const password = this.state.password;

    if (password.value === "") {
      return i18n.error.required;
    }

    return validatePassword(password.value) ? "" : i18n.error.passwordPolicy;
  }

  checkConfirm = () => {
    return this.state.password.value === this.state.passwordConfirm.value ? "" : i18n.error.passwordMatch;
  }

  render() {
    const {classes} = this.props;

    return (
      <LoginLayout>
        <div className={classes.section}>
          <Typography variant="h5" className={classes.pageTitle} gutterBottom>{i18n.pageTitle}</Typography>
        </div>

        {this.state.isValidating ? (
          <Loading/>
        ) : (
          this.renderForm()
        )}
      </LoginLayout>
    );
  }

  renderForm = () => {
    const {classes} = this.props;
    const {isTokenValid, isLoading, isSuccess, password, passwordConfirm} = this.state;
    const passwordError = password.isPristine ? "" : this.checkPassword();
    const confirmError = passwordConfirm.isPristine ? "" : this.checkConfirm();
    const hasError = passwordError !== "" || confirmError !== "";

    return (
      <div>
        {isSuccess && <Alert title={i18n.successTitle} description={i18n.successMessage} type="success"/>}

        {!isTokenValid && (
          <div className={classes.section}>
            <Alert title={i18n.tokenInvalidTitle} description={i18n.tokenInvalidMessage} type="error"/>
          </div>
        )}

        {isTokenValid && !isSuccess && (
          <div>
            <div className={classes.section}>
              <TextField
                className={classes.passwordInput}
                fullWidth
                id="password-input"
                variant="outlined"
                label={i18n.passwordLabel}
                value={password.value}
                onChange={e => this.setState({
                  password: {value: e.target.value, isPristine: false}
                })}
                error={passwordError !== ""}
                helperText={passwordError}
                placeholder={i18n.inputPlaceholder}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" className={classes.adornment}>
                      <Icon>vpn_key</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <TextField
              fullWidth
              id="passwordConfirm-input"
              variant="outlined"
              label={i18n.passwordConfirmLabel}
              value={passwordConfirm.value}
              onChange={e => this.setState({
                passwordConfirm: {value: e.target.value, isPristine: false}
              })}
              error={confirmError !== ""}
              helperText={confirmError}
              placeholder={i18n.inputPlaceholder}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" className={classes.adornment}>
                    <Icon>check_circle_outline</Icon>
                  </InputAdornment>
                ),
              }}
            />

            <div className={classes.section}>
              <Typography variant="caption">{i18n.help}</Typography>
            </div>

            <div className={classes.section}>
              <LoadingButton variant="contained" fullWidth onClick={this.handleClick} color="primary" isLoading={isLoading} disabled={(password.isPristine && passwordConfirm.isPristine) || hasError}>
                {i18n.submitButtonLabel}
              </LoadingButton>
            </div>
          </div>
        )}

        <div className={classes.forgotPasswordContainer}>
          <Button component={Link} to="/login" className={classes.goBackLink}>
            {i18n.goBackLink}
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ChangePasswordPage);
