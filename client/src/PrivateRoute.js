import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import Heading from "./components/Heading";
import SideBar from "./components/SideBar";

const PrivateRoute = ({ component: RouteComponent, path, ...rest }) => {
  const { currentUser } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      path={path}
      /*
      render={(routeProps) =>
        !!currentUser ? (
          <>
            <Heading />
            <SideBar {...routeProps} />
            <RouteComponent {...routeProps} />
          </>
        ) : (
            <Redirect to={"/login"} />
          )
      }
      */
      render={(routeProps) => {
        if (path === "/") {
          if (!!currentUser) {
            return (
              <>
                <Heading />
                <SideBar {...routeProps} />
                <RouteComponent {...routeProps} />
              </>
            );
          } else {
            return <Redirect to={"/home"} />;
          }
        } else {
          if (!!currentUser) {
            return (
              <>
                <Heading />
                <SideBar {...routeProps} />
                <RouteComponent {...routeProps} />
              </>
            );
          } else {
            return <Redirect to={"/login"} />;
          }
        }
      }}
    />
  );
};

export default PrivateRoute;
