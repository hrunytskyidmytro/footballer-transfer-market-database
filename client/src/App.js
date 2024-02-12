import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { FaPersonRunning } from "react-icons/fa6";
import { MdTransferWithinAStation } from "react-icons/md";
import {
  BarChartOutlined,
  ShopOutlined,
  TeamOutlined,
  LeftSquareOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Button } from "antd";

import UserFootballers from "./footballers/pages/UserFootballers";
import AdminDashboard from "./admin/dashboard/components/AdminDashboard";
import NewFootballer from "../../client/src/admin/footballers/pages/NewFootballer";
import UpdateFootballer from "../../client/src/admin/footballers/pages/UpdateFootballer";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Users from "../src/admin/users/pages/Users";
import Footballers from "./admin/footballers/pages/Footballers";

import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import { Link } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const { token, login, logout, userId, role } = useAuth();
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (key) => {
    setSelectedMenuItem(key);
  };

  let routes;

  if (token) {
    routes = (
      <Switch>
        {/* {role === "admin" && (
          <>
            <Redirect from="/" to="/admins" exact />
            <Route path="/admins" exact>
              <AdminDashboard />
            </Route>
          </>
        )} */}
        {role === "admin" && (
          <>
            {/* <Redirect from="/" to="/admins/users" exact />
            <Route path="/admins" component={AdminDashboard} /> */}
            {/* <Route path="/admins/footballers/new" component={NewFootballer} /> */}
            {/* <Route path="/admins/footballers/:footballerId" component={UpdateFootballer} /> */}
          </>
        )}

        {/* <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/" /> */}
      </Switch>
    );
  } else {
    // routes = (
    //   <Switch>
    //     <Route path="/" exact>
    //       <h2>Головна сторінка</h2>
    //     </Route>
    //     <Route path="/:userId/footballers">
    //       <UserFootballers />
    //     </Route>
    //     <Route path="/auth">
    //       <Auth />
    //     </Route>
    //     {/* <Redirect to="/auth" /> */}
    //   </Switch>
    // );
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
        {/* <Router> */}
        {/* {role !== "admin" && <MainNavigation />} */}
        {/* <main>{routes}</main> */}
        {/* </Router> */}
        <Router>
          <Layout
            style={{
              minHeight: "100vh",
            }}
          >
            {role === "admin" ? (
              <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
              >
                <div className="demo-logo-vertical" />
                <Menu
                  theme="dark"
                  mode="inline"
                  defaultSelectedKeys={["1"]}
                  selectedKeys={[selectedMenuItem]}
                  onClick={({ key }) => handleMenuClick(key)}
                >
                  <Menu.Item key="1" icon={<TeamOutlined />}>
                    <Link to="/admins/users">Users</Link>
                  </Menu.Item>
                  <Menu.Item key="2" icon={<FaPersonRunning />}>
                    <Link to="/admins/footballers">Footballers</Link>
                  </Menu.Item>
                  <Menu.Item key="3" icon={<MdTransferWithinAStation />}>
                    <Link to="/admins/transfers">Transfers</Link>
                  </Menu.Item>
                  <Menu.Item key="4" icon={<ShopOutlined />}>
                    <Link to="/admins/clubs">Clubs</Link>
                  </Menu.Item>
                  <Menu.Item key="5" icon={<BarChartOutlined />}>
                    <Link to="/admins/statistics">Statistics</Link>
                  </Menu.Item>
                </Menu>
              </Sider>
            ) : (
              <MainNavigation />
            )}
            <Layout>
              {role === "admin" && (
                <Header
                  style={{
                    padding: 0,
                    background: colorBgContainer,
                    margin: "10px 16px 10px 16px",
                  }}
                >
                  <Button
                    type="primary"
                    onClick={logout}
                    danger
                    style={{
                      fontSize: "16px",
                      width: 64,
                      height: 64,
                    }}
                  >
                    <LeftSquareOutlined />
                  </Button>
                </Header>
              )}
              <Content
                style={{
                  margin: "0px 16px",
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
                  {/* {content} */}
                  <Switch>
                    {role === "admin" && (
                      <>
                        <Redirect from="/" to="/admins/users" exact />
                        {/* <Route path="/admins" component={AdminDashboard} /> */}
                        <Route path="/admins/users" component={Users} />
                        <Route
                          path="/admins/footballers"
                          component={Footballers}
                        />
                        {/* <Route
                          path="/admins/footballers/new"
                          component={NewFootballer}
                        /> */}
                        <Route
                          path="/admins/footballers/:footballerId"
                          component={UpdateFootballer}
                        />
                      </>
                    )}
                    <Route path="/auth" component={Auth} />
                  </Switch>
                </div>
              </Content>
              <Footer
                style={{
                  textAlign: "center",
                }}
              >
                ©{new Date().getFullYear()} Created by Dmytro Hrunytskyi
              </Footer>
            </Layout>
          </Layout>
        </Router>
      </AuthContext.Provider>
    </>
  );
};

export default App;
