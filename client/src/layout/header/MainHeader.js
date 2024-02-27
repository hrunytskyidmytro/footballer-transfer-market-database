import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, Layout, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { AuthContext } from "../../shared/context/auth-context";

const { Header } = Layout;

const MainNavigation = () => {
  const { user, logout, token, role } = useContext(AuthContext);

  return (
    <>
      <Layout>
        <Header>
          <div className="demo-logo" />
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="home">
              <Link to="/">Transfer-market</Link>
            </Menu.Item>
            <Menu.Item key="footballers">
              <Link to="/footballers">Footballers</Link>
            </Menu.Item>
            <Menu.Item key="clubs">
              <Link to="/clubs">Clubs</Link>
            </Menu.Item>
            <Menu.Item key="agents">
              <Link to="/agents">Agents</Link>
            </Menu.Item>
            <Menu.Item key="news">
              <Link to="/news">News</Link>
            </Menu.Item>
            <Menu.Item key="about">
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
                  style={{ height: "100%", padding: "0 20px", textAlign: "center" }}
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
                {role === "admin" && (
                  <Menu.Item key="admin" style={{ textAlign: "center" }}>
                    <Link to="/admins">Admin Panel</Link>
                  </Menu.Item>
                )}
                <Menu.Item
                  key="logout"
                  onClick={logout}
                  style={{ textAlign: "center" }}
                >
                  Logout
                </Menu.Item>
              </Menu.SubMenu>
            ) : (
              <Menu.Item key="login">
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
                    Login
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
