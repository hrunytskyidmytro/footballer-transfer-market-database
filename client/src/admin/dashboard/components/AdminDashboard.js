import React, { useContext, useState } from "react";
import { FaPersonRunning } from "react-icons/fa6";
import { MdTransferWithinAStation } from "react-icons/md";
import {
  BarChartOutlined,
  ShopOutlined,
  TeamOutlined,
  LeftSquareOutlined,
} from "@ant-design/icons";

import "./AdminDashboard.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth-context";
import { Layout, Menu, theme, Button } from "antd";

import Users from "../../../admin/users/pages/Users";
import Footballers from "../../../admin/footballers/pages/Footballers"

const { Header, Content, Footer, Sider } = Layout;

const AdminDashboard = () => {
  const auth = useContext(AuthContext);
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");

  const handleMenuClick = (e) => {
    setSelectedMenuItem(e.key);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  let content = null;
  switch (selectedMenuItem) {
    case "1":
      content = <Users />;
      break;
    case "2":
      content = <Footballers />;
      break;
    case "3":
      content = <h2>Transfers Works!</h2>;
      break;
    case "4":
      content = <h2>Clubs Works!</h2>;
      break;
    case "5":
      content = <h2>Statistics Works!</h2>;
      break;
    default:
      content = null;
  }

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={[selectedMenuItem]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="1" icon={<TeamOutlined />}>
            <NavLink to="/admins">Users</NavLink>
          </Menu.Item>
          <Menu.Item key="2" icon={<FaPersonRunning />}>
            <NavLink to="/admins">Footballers</NavLink>
          </Menu.Item>
          <Menu.Item key="3" icon={<MdTransferWithinAStation />}>
            <NavLink to="/admins">Transfers</NavLink>
          </Menu.Item>
          <Menu.Item key="4" icon={<ShopOutlined />}>
            <NavLink to="/admins">Clubs</NavLink>
          </Menu.Item>
          <Menu.Item key="5" icon={<BarChartOutlined />}>
            <NavLink to="/admins">Statistics</NavLink>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout
        style={{
          marginLeft: 200,
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            marginTop: 10,
          }}
        >
          <Button
            type="primary"
            onClick={auth.logout}
            danger
            style={{
              marginLeft: 1000,
            }}
          >
            <LeftSquareOutlined />
          </Button>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
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
            {content}
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
  );
};

export default AdminDashboard;
