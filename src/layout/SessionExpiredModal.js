{/*<Dialog*/}
{/*open={isSessionExpired}*/}
{/*aria-labelledby="alert-unauthorized-title"*/}
{/*aria-describedby="alert-unauthorized-description"*/}
{/*>*/}
{/*<DialogTitle id="alert-unauthozied-title">Unauthorized</DialogTitle>*/}
{/*<DialogContent>*/}
{/*<DialogContentText id="alert-unauthozied-description">*/}
{/*Your session is no longer active. Please log back in to resume your work.*/}
{/*</DialogContentText>*/}
{/*</DialogContent>*/}
{/*<DialogActions>*/}
{/*<Button onClick={this.handleClose} color="primary" autoFocus>*/}
{/*Log In*/}
{/*</Button>*/}
{/*</DialogActions>*/}
{/*</Dialog>*/}

const mstp = state => ({
  isSessionExpired: state.layout.isSessionExpired
});
