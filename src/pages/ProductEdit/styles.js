const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'center',
  },
  formControl: {
    flexBasis: '40%',
    minWidth: 220,
    marginRight: 5
  },
  tabContent: {
    padding: 20
  },
  err: theme.fieldError
});

export default styles;
