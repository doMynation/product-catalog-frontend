import React, {Component} from 'react';
import ReactTags from 'react-tag-autocomplete'
import 'react-tag-autocomplete/example/styles.css'

class TagsInput extends Component {
  render() {
    return (
      <ReactTags
        tags={this.props.tags}
        suggestions={this.props.suggestions}
        handleAddition={this.props.addHandler}
        handleDelete={this.props.deleteHandler}
        allowNew={true}
        autofocus={false}
      />
    );
  }
}

export default TagsInput;
