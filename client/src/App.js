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
import ErrorModal from "../src/shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../src/shared/components/UIElements/LoadingSpinner";

import NewFootballer from "../../client/src/admin/footballers/pages/NewFootballer";
import UpdateFootballer from "../../client/src/admin/footballers/pages/UpdateFootballer";
import UpdateUser from "./admin/users/pages/UpdateUser";
import NewAgent from "./admin/agents/pages/NewAgent";
import UpdateAgent from "./admin/agents/pages/UpdateAgent";
import NewNews from "./admin/news/pages/NewNews";
import UpdateNews from "./admin/news/pages/UpdateNews";
import NewTransfer from "./admin/transfers/pages/NewTransfer";
import UpdateTransfer from "./admin/transfers/pages/UpdateTransfer";
import NewClub from "./admin/clubs/pages/NewClub";
import UpdateClub from "./admin/clubs/pages/UpdateClub";

import Users from "../src/admin/users/pages/Users";
import Footballers from "./admin/footballers/pages/Footballers";
import Transfers from "../src/admin/transfers/pages/Transfers";
import Clubs from "../src/admin/clubs/pages/Clubs";
import Agents from "../src/admin/agents/pages/Agents";
import News from "../src/admin/news/pages/News";
import AdminHome from "./admin/adminHomePage/pages/AdminHome";

import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import { useHttpClient } from "../src/shared/hooks/http-hook";
import { Link, useLocation } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const location = useLocation();
  const { token, login, logout, userId, role } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [selectedMenuItem, setSelectedMenuItem] = useState(location.pathname);
  const [collapsed, setCollapsed] = useState(false);
  const [loadedUser, setLoadedUser] = useState([]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setSelectedMenuItem(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId) {
          const responseData = await sendRequest(
            `http://localhost:5001/api/users/${userId}`
          );

          setLoadedUser(responseData.user);
        }
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, userId]);

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
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
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
                defaultSelectedKeys={["/admins"]}
                selectedKeys={[selectedMenuItem]}
              >
                <Menu.Item key="/admins" icon={<HomeOutlined />}>
                  <Link to="/admins">Home</Link>
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  // flexDirection: "row-reverse",
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
                <strong
                  style={{
                    fontSize: "16px",
                    width: 64,
                    height: 64,
                    marginRight: 90,
                  }}
                >
                  {loadedUser.email
                    ? loadedUser.email
                    : "Email\u00A0not\u00A0found!"}
                </strong>
              </Header>
            )}
            <Content
              style={{
                margin: "0px 16px",
              }}
            >
              <div
                style={{
                  padding: "20px 10px 20px 10px",
                  textAlign: "center",
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Routes>
                  {token && role === "admin" && (
                    <>
                      <Route path="/admins" element={<AdminHome />} />
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
                      <Route path="/admins/transfers/" element={<Outlet />}>
                        <Route index element={<Transfers />} />
                        <Route path="new" element={<NewTransfer />} />
                        <Route
                          path=":transferId"
                          element={<UpdateTransfer />}
                        />
                      </Route>
                      <Route path="/admins/clubs/" element={<Outlet />}>
                        <Route index element={<Clubs />} />
                        <Route path="new" element={<NewClub />} />
                        <Route path=":clubId" element={<UpdateClub />} />
                      </Route>
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
                      <Route path="*" element={<Navigate to="/admins" />} />
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
