import React from 'react';
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
import {validateEmail} from "../../util/validators";
import Api from "../../util/Api";

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
});

const i18n = {
  pageTitle: "Réinitialiser votre mot de passe",
  successTitle: "Succès!",
  successMessage: "Un courriel contenant les instructions pour changer votre mot de passe a été envoyé à votre adresse.",
  inputLabel: "Courriel",
  inputPlaceholder: "Ex: nom@domaine.com",
  inputError: "Format non valide.",
  buttonLabel: "Envoyer",
  goBackLink: "Se connecter",
};

class ForgotPasswordPage extends React.Component {
  state = {
    isLoading: false,
    isSuccess: false,
    email: {
      value: "",
      isPristine: true
    },
  };

  handleClick = () => {
    this.setState({isLoading: true});

    setTimeout(() => {
      Api
        .resetPassword(this.state.email.value.trim())
        .then(() => {
          this.setState({isLoading: false, isSuccess: true});
        });
    }, 2500);
  }

  isValid = () => {
    if (this.state.email.isPristine) {
      return true;
    }

    const email = this.state.email.value.trim();

    return email !== "" && validateEmail(email);
  }

  render() {
    const {classes} = this.props;
    const {isLoading, isSuccess, email} = this.state;
    const hasError = !this.isValid();

    return (
      <LoginLayout>
        <div className={classes.section}>
          <Typography variant="h5" className={classes.pageTitle} gutterBottom>{i18n.pageTitle}</Typography>

          {isSuccess && <Alert title={i18n.successTitle} description={i18n.successMessage} type="success"/>}
        </div>

        {!isSuccess && (
          <div>
            <div className={classes.section}>
              <TextField
                fullWidth
                id="email-input"
                variant="outlined"
                label={i18n.inputLabel}
                value={email.value}
                onChange={e => this.setState({
                  email: {value: e.target.value, isPristine: false}
                })}
                error={hasError}
                helperText={hasError ? i18n.inputError : ""}
                placeholder={i18n.inputPlaceholder}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" className={classes.adornment}>
                      <Icon>email</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className={classes.section}>
              <LoadingButton variant="contained" fullWidth onClick={this.handleClick} color="primary" isLoading={isLoading} disabled={email.isPristine || hasError}>
                {i18n.buttonLabel}
              </LoadingButton>
            </div>
          </div>
        )}

        <div>
          <Button component={Link} to="/login" className={classes.goBackLink}>
            {i18n.goBackLink}
          </Button>
        </div>
      </LoginLayout>
    );
  }
}

export default withStyles(styles)(ForgotPasswordPage);
