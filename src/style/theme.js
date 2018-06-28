import createMuiTheme from "@material-ui/core/es/styles/createMuiTheme";
import orange from "@material-ui/core/es/colors/orange";
import green from "@material-ui/core/es/colors/green";
import grey from "@material-ui/core/es/colors/grey";
import yellow from "@material-ui/core/es/colors/yellow";
import red from "@material-ui/core/es/colors/red";

const theme = createMuiTheme({
  colors: {
    danger: orange[500],
    success: green[500],
    error: red[500],
    dark: grey[800],

    layout: {
      sectionHeader: '#3C4252',
      pageHeader: grey[400]
    }
  },
  table: {
    rows: {
      striped: {
        '&:hover': {
          backgroundColor: yellow[100] + ' !important'
        },
        '&:nth-of-type(odd)': {
          backgroundColor: grey[100]
        }
      }
    }
  },
  fieldError: {
    color: red[500]
  },
});

export default theme;
