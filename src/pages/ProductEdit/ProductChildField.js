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

class ProductChildField extends Component {
  toggleVisibility = () => {
    const newChild = {...this.props.child, isVisible: !this.props.child.isVisible};
    this.props.onChange(newChild);
  }

  toggleCompiled = () => {
    const newChild = {...this.props.child, isCompiled: !this.props.child.isCompiled};
    this.props.onChange(newChild);
  }

  handleQuantityChange = newQuantity => {
    const newChild = {...this.props.child, quantity: newQuantity};
    this.props.onChange(newChild);
  }

  handleTypeChange = newType => {
    const newChild = {...this.props.child, childType: newType};
    this.props.onChange(newChild);
  }

  render() {
    const {classes, child, onDelete} = this.props;

    return (
      <Grid container alignItems="center" className={classes.root} justify="space-between">
        <Grid item>
          <Grid container justify="center" alignItems="center" className={classes.spaced}>
            <IconButton aria-label="Supprimer" onClick={onDelete} className={classes.deleteButton}>
              <Icon>delete</Icon>
            </IconButton>

            <Typography variant="caption">
              <ProductName sku={child.product.sku} name={child.product.description.name}/>
            </Typography>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container alignItems="center" className={classes.spaced}>
            <Grid item>
              <FormControl>
                <Select
                  value={child.childType}
                  onChange={e => this.handleTypeChange(e.target.value)}
                  inputProps={{
                    id: "child-type",
                    name: "child-type",
                  }}
                >
                  <MenuItem key={`child_type_${child.id}_composed`} value="composed">Composé de</MenuItem>
                  <MenuItem key={`child_type_${child.id}_uses`} value="uses">Utilise</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item>
              <FormControl>
                <Select
                  value={child.quantity}
                  onChange={e => this.handleQuantityChange(e.target.value)}
                  inputProps={{
                    id: "child-qty",
                    name: "child-qty",
                  }}
                >
                  {range(1, 100).map(i => <MenuItem key={`child_${child.id}_${i}`} value={i}>{i}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            <Grid item>
              <Tooltip title="Visible">
                <IconButton className={child.isVisible ? classes.buttonOn : null} onClick={this.toggleVisibility}><Icon>visibility</Icon></IconButton>
              </Tooltip>

              <Tooltip title="Afficher les enfants">
                <IconButton className={child.isCompiled ? classes.buttonOn : null} onClick={this.toggleCompiled}><Icon>device_hub</Icon></IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

ProductChildField.propTypes = {
  child: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(ProductChildField);
