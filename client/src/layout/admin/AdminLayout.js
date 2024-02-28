import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { Layout, theme, Spin } from "antd";

import AdminMenu from "../../admin/adminMenu/components/AdminMenu";
import AdminHeader from "../../admin/adminHeader/components/AdminHeader";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import MainFooter from "../footer/MainFooter";

import { AuthContext } from "../../shared/context/auth-context";

const { Content } = Layout;

const AdminLayout = () => {
  const { user, isLoadingApp, error, clearError } = useContext(AuthContext);

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
        <AdminMenu />
        <Layout>
          <AdminHeader colorBgContainer={colorBgContainer} email={user.email} />
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

export default AdminLayout;
