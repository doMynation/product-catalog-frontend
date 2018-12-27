import React from 'react';
import Route from "react-router-dom/es/Route";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";

const ProtectedRoute = ({component: Component, isAuthenticated, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
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

export default connect(mstp, null)(ProtectedRoute);

