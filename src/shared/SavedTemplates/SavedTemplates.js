import React from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/es/styles/withStyles";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import Icon from "@material-ui/core/es/Icon/Icon";
import Typography from "@material-ui/core/es/Typography/Typography";
import List from "@material-ui/core/es/List/List";
import ListItem from "@material-ui/core/es/ListItem/ListItem";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/es/ListItemSecondaryAction/ListItemSecondaryAction";
import SaveTemplateButton from "./SaveTemplateButton";

const styles = theme => ({
  templatesHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  saveContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing.unit * 2
  },
});

const SavedTemplates = ({classes, items, onSelect, onAdd, onDelete, onClose, allowSave = true}) => {
  // Sort by date descending
  const sortedItems = items.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return dateB - dateA;
  });

  return (
    <div>
      <div className={classes.saveContainer}>
        {allowSave &&
        <SaveTemplateButton onSubmit={onAdd}/>
        }

        <Tooltip title="Retour" placement="top">
          <IconButton aria-label="Retour" onClick={onClose} style={{marginLeft: 'auto'}}>
            <Icon>close</Icon>
          </IconButton>
        </Tooltip>
      </div>

      <div className={classes.templatesHeader}>
        <Icon style={{marginRight: 8}}>history</Icon>
        <Typography variant="title">Listes sauvegardées</Typography>
      </div>

      <List dense>
        {sortedItems.map((item, idx) => {
          return (
            <ListItem key={idx} button onClick={() => onSelect(idx)}>
              <ListItemText primary={item.name} secondary={`créée le ${item.date}`}/>

              <ListItemSecondaryAction>
                <IconButton aria-label="Supprimer" onClick={() => onDelete(idx)}>
                  <Icon>delete</Icon>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}

SavedTemplates.propTypes = {
  items: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  allowSave: PropTypes.bool
};

export default withStyles(styles)(SavedTemplates);
