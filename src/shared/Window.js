import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/es/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/es/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/es/DialogActions/DialogActions";
import Button from "@material-ui/core/es/Button/Button";
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";

const styles = theme => ({
  loading: {...theme.buttonProgress}
});

class Window extends React.Component {
  state = {
    isLoading: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      isLoading: nextProps.isOpen && prevState.isLoading
    }
  }

  handleSubmit = () => {
    this.setState({isLoading: true});

    this.props.onSubmit();
  }

  render() {
    const {classes, isOpen, onClose, title, description, withButtons = true, children} = this.props;

    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
      >
        <DialogTitle id="form-dialog-title">
          {title}
        </DialogTitle>

        <DialogContent>
          <DialogContentText style={{marginBottom: 16}}>{description}</DialogContentText>
          {children}
        </DialogContent>

        {withButtons && (
          <DialogActions>
            <Button onClick={onClose} color="primary">Annuler</Button>
            <Button onClick={this.handleSubmit} color="primary" disabled={this.state.isLoading}>
              Soumettre

              {this.state.isLoading && <CircularProgress className={classes.loading} size={20}/>}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    );
  }
}

Window.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  withButtons: PropTypes.bool,
  onSubmit: PropTypes.func,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default withStyles(styles)(Window);
