import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { Layout, theme, Spin } from "antd";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import MainHeader from "../header/MainHeader";
import MainFooter from "../footer/MainFooter";

import { AuthContext } from "../../shared/context/auth-context";

const { Content } = Layout;

const UserLayout = () => {
  const { isLoadingApp, error, clearError } = useContext(AuthContext);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <MainHeader />
        <Layout>
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
              <ErrorModal error={error} onClear={clearError} />
              {isLoadingApp && (
                <div className="center">
                  <Spin size="large" />
                </div>
              )}
              <Outlet />
            </div>
          </Content>
          <MainFooter />
        </Layout>
      </Layout>
    </>
  );
};

export default UserLayout;
