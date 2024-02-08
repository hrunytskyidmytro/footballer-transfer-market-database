import React, { useContext, useState } from "react";
import { FaPersonRunning } from "react-icons/fa6";
import { MdTransferWithinAStation } from "react-icons/md";
import {
  BarChartOutlined,
  ShopOutlined,
  TeamOutlined,
  LeftSquareOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

import "./AdminDashboard.css";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth-context";
import { Layout, Menu, theme, Button } from "antd";

import Users from "../../../admin/users/pages/Users";
import Footballers from "../../../admin/footballers/pages/Footballers";
import Transfers from "../../../admin/transfers/pages/Transfers";
import Clubs from "../../../admin/clubs/pages/Clubs";

const { Header, Content, Footer, Sider } = Layout;

const AdminDashboard = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");
  const [collapsed, setCollapsed] = useState(false);

  // const handleMenuClick = (e) => {
  //   setSelectedMenuItem(e.key);
  // };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (key) => {
    setSelectedMenuItem(key);
    switch (key) {
      case "1":
        history.push("/admins/users");
        break;
      case "2":
        history.push("/admins/footballers");
        break;
      case "3":
        history.push("/admins/transfers");
        break;
      case "4":
        history.push("/admins/clubs");
        break;
      case "5":
        history.push("/admins/statistics");
        break;
      default:
        break;
    }
  };

  let content = null;
  switch (window.location.pathname) {
    case "/admins/users":
      content = <Users />;
      break;
    case "/admins/footballers":
      content = <Footballers />;
      break;
    case "/admins/transfers":
      content = <Transfers />;
      break;
    case "/admins/clubs":
      content = <Clubs />;
      break;
    case "/admins/statistics":
      content = <h2>Statistics Works!</h2>;
      break;
    default:
      content = null;
      break;
  }

  // let content = null;
  // switch (selectedMenuItem) {
  //   case "1":
  //     content = <Users />;
  //     break;
  //   case "2":
  //     content = <Footballers />;
  //     break;
  //   case "3":
  //     content = <Transfers />;
  //     break;
  //   case "4":
  //     content = <Clubs />;
  //     break;
  //   case "5":
  //     content = <h2>Statistics Works!</h2>;
  //     break;
  //   default:
  //     content = null;
  // }

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={[selectedMenuItem]}
          onClick={({ key }) => handleMenuClick(key)}
          items={[
            {
              key: "1",
              icon: <TeamOutlined />,
              label: "Users",
            },
            {
              key: "2",
              icon: <FaPersonRunning />,
              label: "Footballers",
            },
            {
              key: "3",
              icon: <MdTransferWithinAStation />,
              label: "Transfers",
            },
            {
              key: "4",
              icon: <ShopOutlined />,
              label: "Clubs",
            },
            {
              key: "5",
              icon: <BarChartOutlined />,
              label: "Statistics",
            },
          ]}
        />
        {/* <Menu.Item key="1" icon={<TeamOutlined />}>
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
        </Menu> */}
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            marginTop: 10,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Button
            type="primary"
            onClick={auth.logout}
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
        <Content
          style={{
            overflow: "initial",
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
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
