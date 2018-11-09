import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import AutoComplete from "../AutoComplete";
import ProductChildField from "../../pages/ProductEdit/ProductChildField";
import ProductRepository from "../../util/ProductRepository";

const styles = theme => ({
  childrenContainer: {
    marginTop: theme.spacing.unit * 2
  }
});

// @todo: Move this elsewhere
const search = needle => {
  return ProductRepository
    .quickSearch(needle)
    .then(resp =>
      resp.body.data.map(product => ({value: product, label: product.description.name}))
    );
};

const createChild = product => ({
  id: `NEW_${Math.random() * 20}`,
  isVisible: false,
  isCompiled: false,
  product: product,
  childType: "composed",
  quantity: 1,
});

class ChildrenPicker extends Component {
  handleAdd = product => {
    const newChildren = this.props.children.concat(createChild(product));

    this.props.onChange(newChildren);
  }

  handleDelete = idx => {
    const newChildren = [...this.props.children];
    newChildren.splice(idx, 1);

    this.props.onChange(newChildren);
  }

  handleChange = (key, newChild) => {
    const newChildren = [...this.props.children];
    newChildren[key] = newChild;

    this.props.onChange(newChildren);
  }

  render() {
    const {classes, children} = this.props;

    return (
      <div>
        <AutoComplete
          onChange={selected => this.handleAdd(selected.value)}
          formatOption={({value}) => `[${value.sku}] ${value.description.name}`}
          placeholder="Cherchez une pièce (ex: ATT90) ..."
          isAsync
          asyncFetch={search}
          clearOnSelect
        />

        <div className={classes.childrenContainer}>
          {children.map((child, key) =>
            <ProductChildField
              key={`child_${key}`} child={child}
              onChange={newChild => this.handleChange(key, newChild)}
              onDelete={() => this.handleDelete(key)}
            />
          )}
        </div>
      </div>
    );
  }
}

ChildrenPicker.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(ChildrenPicker);
