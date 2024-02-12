import React, { useContext } from "react";
// import { Link } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./MainNavigation.css";
import { Layout, Menu } from "antd";

const { Header } = Layout;

const MainNavigation = () => {
  const auth = useContext(AuthContext);

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        {/* <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{ flex: 1, minWidth: 0 }}
          selectedKeys={[]}
          items={[
            {
              key: "1",
              label: "Footballers",
            },
            {
              key: "2",
              label: "Transfers",
            },
            {
              key: "3",
              label: "Clubs",
            },
            {
              key: "4",
              label: "Agents",
            },
            {
              key: "5",
              label: "Login",
            },
          ]}
        /> */}
          {/* <Menu.Item key="1" className="main-navigation__home-page">
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
          <Menu.Item key="5">
            <Link to="/auth">Login</Link>
          </Menu.Item>
          {auth.token && (
            <Menu.Item key="6">
              <button onClick={auth.logout}>Log out</button>
            </Menu.Item>
          )} */}
        {/* </Menu> */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <a href="/footballers">Footballers</a>
          <a href="/transfers">Transfers</a>
          <a href="/clubs">Clubs</a>
          <a href="/agents">Agents</a>
          <a href="/auth">Login</a>
        </div>
      </Header>
    </Layout>
  );
};

export default MainNavigation;
