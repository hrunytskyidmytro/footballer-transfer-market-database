import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Layout, Avatar, Typography } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  RobotOutlined,
} from "@ant-design/icons";

import { AuthContext } from "../../../shared/context/auth-context";

const { Header } = Layout;
const { Text } = Typography;

const MainHeader = () => {
  const { user, logout, token, role } = useContext(AuthContext);
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState(location.pathname);

  useEffect(() => {
    setSelectedMenuItem(location.pathname);
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: "90px" }}>
      <Header
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link to="/">
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
            TRANSFER-MARKET
          </div>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["/"]}
          selectedKeys={[selectedMenuItem]}
          style={{ flex: 17, justifyContent: "center" }}
        >
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
            <Link to="/about">About Us</Link>
          </Menu.Item>
        </Menu>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{
            flex: "auto",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          defaultSelectedKeys={["/"]}
          selectedKeys={[selectedMenuItem]}
        >
          {token ? (
            <Menu.SubMenu
              key="/userMenu"
              title={
                <span
                  style={{
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    shape="square"
                    size={32}
                    icon={<UserOutlined />}
                    style={{
                      marginBottom: 5,
                      marginRight: 5,
                      backgroundColor: "#1677FF",
                    }}
                  />
                  {user.name || ""}
                </span>
              }
            >
              <Menu.Item
                key="/profile"
                disabled
                style={{
                  width: "200px",
                  height: "100%",
                  padding: "0 20px",
                  textAlign: "center",
                }}
              >
                <RobotOutlined
                  style={{ cursor: "auto", color: "white", fontSize: 16 }}
                />
                <Text
                  style={{
                    cursor: "auto",
                    color: "white",
                    fontSize: 16,
                    display: "block",
                  }}
                >
                  {user.name || ""} {user.surname || ""}
                </Text>
                <Text
                  style={{
                    cursor: "auto",
                    color: "white",
                    fontSize: 14,
                    display: "block",
                  }}
                >
                  {user.email || ""}
                </Text>
                <div style={{ margin: 10 }} />
              </Menu.Item>
              {(role === "admin" || role === "football_manager") && (
                <>
                  <Menu.Divider style={{ borderColor: "white" }} />
                  <Menu.Item
                    key="/admins"
                    style={{ textAlign: "center" }}
                    icon={<SettingOutlined />}
                  >
                    <Link to="/admins">Admin Panel</Link>
                  </Menu.Item>
                  <Menu.Divider style={{ borderColor: "white" }} />
                </>
              )}
              <Menu.Item
                key="/logout"
                onClick={logout}
                style={{ textAlign: "center" }}
                icon={<LogoutOutlined />}
              >
                Log Out
              </Menu.Item>
            </Menu.SubMenu>
          ) : (
            <Menu.Item key="/custom-auth">
              <Link to="/auth">
                <span style={{ color: "#fff" }}>
                  <Avatar
                    shape="square"
                    size={32}
                    icon={<UserOutlined />}
                    style={{
                      marginBottom: 5,
                      marginRight: 5,
                      backgroundColor: "#1677FF",
                    }}
                  />
                  Log In
                </span>
              </Link>
            </Menu.Item>
          )}
        </Menu>
      </Header>
    </Layout>
  );
};

export default MainHeader;
