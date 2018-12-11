import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Icon from "@material-ui/core/es/Icon/Icon";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Select from "@material-ui/core/es/Select/Select";
import {range} from "lodash";
import MenuItem from "@material-ui/core/es/MenuItem/MenuItem";
import FormControl from "@material-ui/core/es/FormControl/FormControl";
import Grid from "@material-ui/core/es/Grid/Grid";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import ProductName from "../../shared/ProductName";
import Typography from "@material-ui/core/es/Typography/Typography";
import TextField from "@material-ui/core/es/TextField/TextField";
import InputAdornment from "@material-ui/core/es/InputAdornment/InputAdornment";
import InputLabel from "@material-ui/core/es/InputLabel/InputLabel";

const i18n = {
  typeIncluded: "Inclus",
  typeMandatory: "Obligatoire",
  inputLabel: {
    price: "Prix réduit",
    quantity: "Quantité",
  }
};

const RULE_TYPES = {
  NORMAL: "normal",
  INCLUDED: "included",
  MANDATORY: "mandatory",
};

const styles = theme => ({
  buttonOn: {
    color: 'inherit'
  },
  root: {
    marginBottom: theme.spacing.unit,
    padding: theme.spacing.unit / 2,
    backgroundColor: theme.palette.grey[100],
    borderColor: theme.palette.grey[500],
    borderWidth: 1,
    borderRadius: theme.spacing.unit
  },
  controls: {
    marginRight: theme.spacing.unit
  },
  spaced: {
    '& > *': {
      marginRight: theme.spacing.unit
    }
  }
});

class SalesRule extends Component {
  toggleIncluded = () => {
    const currentType = this.props.rule.ruleType;

    this.props.onChange({
      ...this.props.rule,
      ruleType: currentType === RULE_TYPES.INCLUDED ? RULE_TYPES.NORMAL : RULE_TYPES.INCLUDED,
      newPrice: currentType === RULE_TYPES.INCLUDED ? 0.00 : this.props.rule.newPrice
    });
  }

  toggleMandatory = () => {
    const currentType = this.props.rule.ruleType;

    this.props.onChange({
      ...this.props.rule,
      ruleType: currentType === RULE_TYPES.MANDATORY ? RULE_TYPES.NORMAL : RULE_TYPES.MANDATORY,
    });
  }

  handleQuantityChange = newQuantity => {
    this.props.onChange({...this.props.rule, quantity: newQuantity});
  }

  handlePriceChange = newPrice => {
    this.props.onChange({...this.props.rule, newPrice: newPrice});
  }

  render() {
    const {classes, rule, onDelete} = this.props;

    return (
      <Grid container alignItems="center" className={classes.root} justify="space-between">
        <Grid item>
          <Grid container justify="center" alignItems="center" className={classes.spaced}>
            <IconButton aria-label="Supprimer" onClick={onDelete} className={classes.deleteButton}>
              <Icon>delete</Icon>
            </IconButton>

            <Typography variant="caption">
              <ProductName sku={rule.product.sku} name={rule.product.description.name}/>
            </Typography>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container alignItems="center" className={classes.spaced}>
            {rule.ruleType !== RULE_TYPES.INCLUDED &&
            <Grid item>
              <TextField
                label={i18n.inputLabel.price}
                placeholder="Ex: 10.45"
                onChange={e => this.handlePriceChange(e.target.value)}
                value={rule.newPrice}
                type="number"
                onFocus={e => e.target.select()}
                InputProps={{
                  startAdornment:
                    <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            }

            {(rule.ruleType === RULE_TYPES.INCLUDED || rule.ruleType === RULE_TYPES.MANDATORY) &&
            <Grid item>
              <FormControl>
                <InputLabel>{i18n.inputLabel.quantity}</InputLabel>
                <Select
                  value={rule.quantity}
                  onChange={e => this.handleQuantityChange(e.target.value)}
                  inputProps={{
                    id: "rule-qty",
                    name: "rule-qty",
                  }}
                >
                  {range(1, 100).map(i => <MenuItem key={`rule_${rule.id}_${i}`} value={i}>{i}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            }

            <Grid item>
              <Tooltip title={i18n.typeIncluded}>
                <IconButton className={rule.ruleType === RULE_TYPES.INCLUDED ? classes.buttonOn : null} onClick={this.toggleIncluded}><Icon>check_circle</Icon></IconButton>
              </Tooltip>

              <Tooltip title={i18n.typeMandatory}>
                <IconButton className={rule.ruleType === RULE_TYPES.MANDATORY ? classes.buttonOn : null} onClick={this.toggleMandatory}>
                  <Icon>{rule.ruleType === RULE_TYPES.MANDATORY ? "lock" : "lock_open"}</Icon>
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

SalesRule.propTypes = {
  rule: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default withStyles(styles)(SalesRule);
