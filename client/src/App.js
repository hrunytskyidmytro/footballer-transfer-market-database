import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaPersonRunning } from "react-icons/fa6";
import { MdTransferWithinAStation } from "react-icons/md";
import { LiaFutbolSolid } from "react-icons/lia";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Users from "./user/pages/Users";
import NewFootballer from "./footballers/pages/NewFootballer";
import UpdateFootballer from "./footballers/pages/UpdateFootballer";
import UserFootballers from "./footballers/pages/UserFootballers";
import AdminDashboard from "./admin/dashboard/AdminDashboard";
import UsersList from "./admin/users/components/UsersList";
import FootballersList from "./admin/footballers/components/FootballersList";
import TransfersList from "./admin/transfers/components/TransfersList";
import ClubsList from "./admin/clubs/components/ClubsList";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Button, Flex } from "antd";
const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { token, login, logout, userId, role } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        {role === "admin" && (
          <>
            <Redirect from="/" to="/admins" exact />
            <Route path="/admins" exact>
              {/* <AdminDashboard /> */}
            </Route>
            <Route path="/admins/users" exact>
              <Users />
            </Route>
            <Route path="/admins/footballers" exact>
              <FootballersList />
            </Route>
            <Route path="/admins/transfers" exact>
              <TransfersList />
            </Route>
            <Route path="/admins/clubs" exact>
              <ClubsList />
            </Route>
          </>
        )}

        <Route path="/" exact>
          <Users />
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
          <Users />
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
          {/* {role === "user" && <MainNavigation />} */}
          {/* {!isLoggedIn || role === "user" && (
            <Layout>
              <Header
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div className="demo-logo" />
                <Menu
                  theme="dark"
                  mode="horizontal"
                  defaultSelectedKeys={["2"]}
                  items={[
                    {
                      key: "1",
                      label: "Users",
                    },
                    {
                      key: "2",
                      label: "Footballers",
                    },
                    {
                      key: "3",
                      label: "Transfers",
                    },
                    {
                      key: "4",
                      label: "Clubs",
                    },
                    {
                      key: "5",
                      label: "Login",
                    },
                  ]}
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                />
                 <Button
                type="primary"
                onClick={login}
                danger
                style={{
                  marginLeft: 1100,
                }}
              >
                Auth
              </Button>
              </Header>
            </Layout>
          )} */}
          <main>{routes}</main>
        </Router>
      </AuthContext.Provider>
      {role === "admin" && (
        <Layout hasSider>
          <Sider
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <div className="demo-logo-vertical" />
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={[
                {
                  key: "1",
                  icon: <TeamOutlined />,
                  label: "Users",
                },
                {
                  key: "2",
                  icon: <FaPersonRunning />,
                  label: "Footballers",
                },
                {
                  key: "3",
                  icon: <MdTransferWithinAStation />,
                  label: "Transfers",
                },
                {
                  key: "4",
                  icon: <ShopOutlined />,
                  label: "Clubs",
                },
                {
                  key: "5",
                  icon: <BarChartOutlined />,
                  label: "Statistics",
                },
              ]}
            />
          </Sider>
          <Layout
            style={{
              marginLeft: 200,
            }}
          >
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
                marginTop: 10,
              }}
            >
              <Button
                type="primary"
                onClick={logout}
                danger
                style={{
                  marginLeft: 1100,
                }}
              >
                Exit
              </Button>
            </Header>
            <Content
              style={{
                margin: "24px 16px 0",
                overflow: "initial",
              }}
            >
              <div
                style={{
                  padding: 24,
                  textAlign: "center",
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <p>long content</p>
              </div>
            </Content>
            <Footer
              style={{
                textAlign: "center",
              }}
            >
              Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
      )}
    </>
  );
};

export default App;
