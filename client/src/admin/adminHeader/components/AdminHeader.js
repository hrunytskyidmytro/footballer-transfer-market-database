import React from "react";
import { Link } from "react-router-dom";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

import { Layout, Button, Avatar } from "antd";

const { Header } = Layout;

const AdminHeader = ({ colorBgContainer, email }) => {
  return (
    <>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
          margin: "10px 16px 10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link to="/home/">
          <Button
            type="primary"
            danger
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          >
            <LogoutOutlined />
          </Button>
        </Link>
        <strong
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 10,
            }}
          >
            <Avatar
              shape="square"
              icon={<UserOutlined />}
              style={{
                padding: 20,
                fontSize: "25px",
                marginBottom: "2px",
                marginRight: "5px",
                backgroundColor: "#239ADE",
              }}
            />
            {email ? email : "Email\u00A0not\u00A0found!"}
          </span>
        </strong>
      </Header>
    </>
  );
};

export default AdminHeader;
