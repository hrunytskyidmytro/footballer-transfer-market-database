import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./MainNavigation.css";
import { Layout, Menu } from "antd";

const { Header } = Layout;

const MainNavigation = () => {
  const auth = useContext(AuthContext);

  return (
    <Layout>
      <Header>
        <div className="demo-logo" />
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1" className="main-navigation__home-page">
            <Link to="/">Transfer-market</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/footballers">Footballers</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/transfers">Transfers</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/clubs">Clubs</Link>
          </Menu.Item>
          {!auth.token ? (
            <Menu.Item key="5">
              <Link to="/auth">Login</Link>
            </Menu.Item>
          ) : (
            <Menu.Item key="6" onClick={auth.logout}>
              Log out
            </Menu.Item>
          )}
        </Menu>
      </Header>
    </Layout>
  );
};

export default MainNavigation;
