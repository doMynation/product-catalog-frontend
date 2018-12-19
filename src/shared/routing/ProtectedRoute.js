import React from 'react';
import Route from "react-router-dom/es/Route";
import {Redirect} from "react-router-dom";
import Session from "../../util/Session";

const ProtectedRoute = ({component: Component, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props =>
        Session.isAuthenticated() ? (
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

export default ProtectedRoute;
