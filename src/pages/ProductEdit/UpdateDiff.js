import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import ValueDiff from "./ValueDiff";
import compose from "redux/src/compose";
import connect from "react-redux/es/connect/connect";

const styles = theme => ({});

class UpdateDiff extends React.PureComponent {
  computeDiff = field => {
    if (field.label === "Attributs") return false

    const hasError = field.checkError === undefined ? false : field.checkError && field.error !== "";

    return field.oldValue !== field.value && !hasError;
  }

  render() {
    const {fields} = this.props;

    return (
      <div>
        {Object.entries(fields).map(([key, field]) => {
          const diff = this.computeDiff(field);
          let oldValue = null;
          let newValue = null;

          if (diff === false) return "";

          if (field.format) {
            oldValue = field.format(field.oldValue)
            newValue = field.format(field.value)
          } else {
            oldValue = field.oldValue;
            newValue = field.value;
          }

          return <ValueDiff key={`valuediff_${key}`} label={field.label} before={oldValue} after={newValue}/>
        })}
      </div>
    );
  }
}

UpdateDiff.propTypes = {
  product: PropTypes.object,
  categories: PropTypes.objectOf(PropTypes.object),
};

const mstp = ({shared, productEdit}) => ({
  categories: shared.data.categories,
  product: productEdit.product,
  fields: productEdit.fields,
});

export default compose(
  withStyles(styles),
  connect(mstp, null)
)(UpdateDiff);
