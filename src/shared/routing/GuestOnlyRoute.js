import React from 'react';
import Route from "react-router-dom/es/Route";
import {Redirect} from "react-router-dom";
import Session from "../../util/Session";

const GuestOnlyRoute = ({component: Component, fallbackPath, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props =>
        !Session.isAuthenticated() ? (
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

export default GuestOnlyRoute;

