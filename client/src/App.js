import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import NewFootballer from "./footballers/pages/NewFootballer";
import UpdateFootballer from "./footballers/pages/UpdateFootballer";
import UserFootballers from "./footballers/pages/UserFootballers";
import AdminDashboard from "./admin/dashboard/components/AdminDashboard";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
  const { token, login, logout, userId, role } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        {role === "admin" && (
          <>
            <Redirect from="/" to="/admins" exact />
            <Route path="/admins" exact>
              <AdminDashboard />
            </Route>
          </>
        )}

        <Route path="/" exact>
          {/* <Users /> */}
        </Route>
        <Route path="/:userId/footballers">
          <UserFootballers />
        </Route>
        <Route path="/footballers/new" exact>
          <NewFootballer />
        </Route>
        <Route path="/footballers/:footballerId">
          <UpdateFootballer />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          {/* <Users /> */}
        </Route>
        <Route path="/:userId/footballers">
          <UserFootballers />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          role: role,
          login: login,
          logout: logout,
        }}
      >
        <Router>
          {role !== "admin" && <MainNavigation />}
          <main>{routes}</main>
        </Router>
      </AuthContext.Provider>
    </>
  );
};

export default App;
