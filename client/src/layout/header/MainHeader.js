import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Layout, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { AuthContext } from "../../shared/context/auth-context";

const { Header } = Layout;

const MainNavigation = () => {
  const { user, logout, token, role } = useContext(AuthContext);
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState(location.pathname);

  useEffect(() => {
    setSelectedMenuItem(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Layout style={{ minHeight: "90px" }}>
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["/"]}
            selectedKeys={[selectedMenuItem]}
          >
            <Menu.Item key="/">
              <Link to="/">Transfer-market</Link>
            </Menu.Item>
            <Menu.Item key="/footballers">
              <Link to="/footballers">Footballers</Link>
            </Menu.Item>
            <Menu.Item key="/clubs">
              <Link to="/clubs">Clubs</Link>
            </Menu.Item>
            <Menu.Item key="/agents">
              <Link to="/agents">Agents</Link>
            </Menu.Item>
            <Menu.Item key="/news">
              <Link to="/news">News</Link>
            </Menu.Item>
            <Menu.Item key="/about">
              <Link to="/about">About us</Link>
            </Menu.Item>
            {token ? (
              <Menu.SubMenu
                key="userMenu"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                title={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      background: "#2c3e50",
                      borderRadius: 10,
                      padding: "0px 10px",
                      color: "white",
                    }}
                  >
                    <Avatar
                      shape="square"
                      size={32}
                      icon={<UserOutlined />}
                      style={{ marginBottom: 5, marginRight: 5 }}
                    />
                    {user.name || ""}
                  </span>
                }
              >
                <Menu.Item
                  key="profile"
                  disabled
                  style={{
                    height: "100%",
                    padding: "0 20px",
                    textAlign: "center",
                  }}
                >
                  <div>
                    <div>
                      {user.name || ""} {user.surname || ""}
                    </div>
                    <div>
                      <span
                        onClick={() => {
                          navigator.clipboard.writeText(user.email);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {user.email || ""}
                      </span>
                    </div>
                  </div>
                </Menu.Item>
                {(role === "admin" || role === "football_manager") && (
                  <Menu.Item key="/admins" style={{ textAlign: "center" }}>
                    <Link to="/admins">Admin Panel</Link>
                  </Menu.Item>
                )}
                <Menu.Item
                  key="logout"
                  onClick={logout}
                  style={{ textAlign: "center" }}
                >
                  Log Out
                </Menu.Item>
              </Menu.SubMenu>
            ) : (
              <Menu.Item key="/auth">
                <Link to="/auth">
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Avatar
                      shape="square"
                      size={32}
                      icon={<UserOutlined />}
                      style={{ marginBottom: 5, marginRight: 5 }}
                    />
                    Log In
                  </span>
                </Link>
              </Menu.Item>
            )}
          </Menu>
        </Header>
      </Layout>
    </>
  );
};

export default MainNavigation;
