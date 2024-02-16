import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { FaPersonRunning } from "react-icons/fa6";
import { MdTransferWithinAStation } from "react-icons/md";
import {
  BarChartOutlined,
  ShopOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  LeftSquareOutlined,
  ReadOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Button } from "antd";

import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

import NewFootballer from "../../client/src/admin/footballers/pages/NewFootballer";
import UpdateFootballer from "../../client/src/admin/footballers/pages/UpdateFootballer";
import UpdateUser from "./admin/users/pages/UpdateUser";
import NewAgent from "./admin/agents/pages/NewAgent";
import UpdateAgent from "./admin/agents/pages/UpdateAgent";
import NewNews from "./admin/news/pages/NewNews";
import UpdateNews from "./admin/news/pages/UpdateNews";

import Users from "../src/admin/users/pages/Users";
import Footballers from "./admin/footballers/pages/Footballers";
import Transfers from "../src/admin/transfers/pages/Transfers";
import Clubs from "../src/admin/clubs/pages/Clubs";
import Agents from "../src/admin/agents/pages/Agents";
import News from "../src/admin/news/pages/News";

import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import { Link, useLocation } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const location = useLocation();
  const { token, login, logout, userId, role } = useAuth();
  const [selectedMenuItem, setSelectedMenuItem] = useState(location.pathname);
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setSelectedMenuItem(location.pathname);
  }, [location.pathname]);

  // let routes;

  // if (token) {
  //   routes = (
  //     <Routes>
  //       {role === "admin" && (
  //         <>
  //           {/* <Redirect from="/" to="/admins/users" exact />
  //           <Route path="/admins" component={AdminDashboard} /> */}
  //           {/* <Route path="/admins/footballers/new" component={NewFootballer} /> */}
  //           {/* <Route path="/admins/footballers/:footballerId" component={UpdateFootballer} /> */}
  //         </>
  //       )}
  //     </Routes>
  //   );
  // } else {
  // }

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
        <Layout
          style={{
            minHeight: "100vh",
          }}
        >
          {token && role === "admin" ? (
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
            >
              <div className="demo-logo-vertical" />
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={["/admins/users"]}
                selectedKeys={[selectedMenuItem]}
              >
                <Menu.Item key="/admins/" icon={<HomeOutlined />}>
                  <Link to="/admins/">Home</Link>
                </Menu.Item>
                <Menu.Item key="/admins/users" icon={<TeamOutlined />}>
                  <Link to="/admins/users">Users</Link>
                </Menu.Item>
                <Menu.Item key="/admins/footballers" icon={<FaPersonRunning />}>
                  <Link to="/admins/footballers">Footballers</Link>
                </Menu.Item>
                <Menu.Item
                  key="/admins/transfers"
                  icon={<MdTransferWithinAStation />}
                >
                  <Link to="/admins/transfers">Transfers</Link>
                </Menu.Item>
                <Menu.Item key="/admins/clubs" icon={<ShopOutlined />}>
                  <Link to="/admins/clubs">Clubs</Link>
                </Menu.Item>
                <Menu.Item key="/admins/agents" icon={<UserSwitchOutlined />}>
                  <Link to="/admins/agents">Agents</Link>
                </Menu.Item>
                <Menu.Item key="/admins/news" icon={<ReadOutlined />}>
                  <Link to="/admins/news">News</Link>
                </Menu.Item>
                <Menu.Item key="/admins/statistics" icon={<BarChartOutlined />}>
                  <Link to="/admins/statistics">Statistics</Link>
                </Menu.Item>
              </Menu>
            </Sider>
          ) : (
            <MainNavigation />
          )}
          <Layout>
            {token && role === "admin" && (
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
                <Routes>
                  {token && role === "admin" && (
                    <>
                      <Route path="/admins/users/" element={<Outlet />}>
                        <Route index element={<Users />} />
                        <Route path=":userId" element={<UpdateUser />} />
                      </Route>
                      <Route path="/admins/footballers/" element={<Outlet />}>
                        <Route index element={<Footballers />} />
                        <Route path="new" element={<NewFootballer />} />
                        <Route
                          path=":footballerId"
                          element={<UpdateFootballer />}
                        />
                      </Route>
                      <Route path="/admins/transfers" element={<Transfers />} />
                      <Route path="/admins/clubs" element={<Clubs />} />
                      <Route path="/admins/agents/" element={<Outlet />}>
                        <Route index element={<Agents />} />
                        <Route path="new" element={<NewAgent />} />
                        <Route path=":agentId" element={<UpdateAgent />} />
                      </Route>
                      <Route path="/admins/news/" element={<Outlet />}>
                        <Route index element={<News />} />
                        <Route path="new" element={<NewNews />} />
                        <Route path=":newId" element={<UpdateNews />} />
                      </Route>
                      <Route
                        path="*"
                        element={<Navigate to="/admins/users" />}
                      />
                    </>
                  )}
                  {!token && <Route path="/auth" element={<Auth />} />}
                </Routes>
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
      </AuthContext.Provider>
    </>
  );
};

export default App;
