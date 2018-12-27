import React from 'react';
import Route from "react-router-dom/es/Route";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";

const GuestOnlyRoute = ({component: Component, fallbackPath, isAuthenticated, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: fallbackPath,
              state: {from: props.location}
            }}
          />
        )
      }
    />
  );
}

const mstp = ({shared}) => ({
  isAuthenticated: shared.isAuthenticated
});

export default connect(mstp, null)(GuestOnlyRoute);

