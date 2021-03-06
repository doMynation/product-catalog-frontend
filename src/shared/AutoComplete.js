import React from 'react';
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/es/Typography/Typography";
import TextField from "@material-ui/core/es/TextField/TextField";
import MenuItem from "@material-ui/core/es/MenuItem/MenuItem";
import Paper from "@material-ui/core/es/Paper/Paper";
import Select from "react-select";
import withStyles from "@material-ui/core/es/styles/withStyles";
import AsyncSelect from 'react-select/lib/Async';

const styles = theme => ({
  root: {
    width: '100%'
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    marginTop: theme.spacing.unit,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({inputRef, ...props}) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Option,
  Control,
  NoOptionsMessage,
  Placeholder,
  SingleValue,
  ValueContainer,
  Menu,
};

class AutoComplete extends React.Component {
  state = {
    value: ""
  };

  onChange = value => {
    // Fixes bug when pressing backspace when the autocomplete input is empty
    if (value === undefined || value.length === 0) {
      return;
    }

    this.props.onChange(value);

    this.setState({value: value});
  }

  render() {
    const {classes, theme, options, placeholder = "", clearOnSelect = false, isAsync = false, asyncFetch = null, formatOption = null} = this.props;
    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
      }),
    };

    const conditionalProps = {};
    if (formatOption !== null) conditionalProps.formatOptionLabel = formatOption;

    return (
      <div className={classes.root}>
        {isAsync ?
          <AsyncSelect
            classes={classes}
            styles={selectStyles}
            components={components}
            onChange={this.onChange}
            placeholder={placeholder}
            value={clearOnSelect ? "" : this.state.value}
            autoFocus
            cacheOptions
            loadOptions={asyncFetch}
            {...conditionalProps}
          /> :
          <Select
            classes={classes}
            styles={selectStyles}
            options={options}
            components={components}
            onChange={this.onChange}
            placeholder={placeholder}
            value={clearOnSelect ? "" : this.state.value}
            autoFocus
            {...conditionalProps}
          />
        }
      </div>
    );
  }
}

AutoComplete.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  clearOnSelect: PropTypes.bool,
  isAsync: PropTypes.bool,
  asyncFetch: PropTypes.func,
  formatOption: PropTypes.func,
};

export default withStyles(styles, {withTheme: true})(AutoComplete);
