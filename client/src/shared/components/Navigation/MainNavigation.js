import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, Layout, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";

import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import "./MainNavigation.css";

const { Header } = Layout;

const MainNavigation = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (auth.userId) {
          const responseData = await sendRequest(
            `http://localhost:5001/api/users/${auth.userId}`
          );

          setLoadedUser(responseData.user);
        }
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, auth.userId]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
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
            {auth.token ? (
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
                    {loadedUser.name ? loadedUser.name : ""}
                  </span>
                }
              >
                <Menu.Item
                  key="profile"
                  disabled
                  style={{ width: 200, height: 120, textAlign: "center" }}
                >
                  <div>
                    <div>
                      {loadedUser.name ? loadedUser.name : ""}{" "}
                      {loadedUser.surname ? loadedUser.surname : ""}
                    </div>
                    <div>
                      {loadedUser.email ? (
                        <span
                          onClick={() => {
                            navigator.clipboard.writeText(loadedUser.email);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {loadedUser.email}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </Menu.Item>
                {auth.role === "admin" && (
                  <Menu.Item key="admin" style={{ textAlign: "center" }}>
                    <Link to="/admins">Admin Panel</Link>
                  </Menu.Item>
                )}
                <Menu.Item
                  key="logout"
                  onClick={auth.logout}
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
