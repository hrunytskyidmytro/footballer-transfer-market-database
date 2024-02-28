import React, { useState, useEffect, useContext } from "react";
import { Layout, Menu } from "antd";
import { FaPersonRunning } from "react-icons/fa6";
import { MdTransferWithinAStation } from "react-icons/md";
import {
  BarChartOutlined,
  ShopOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  ReadOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth-context";

const { Sider } = Layout;

const AdminMenu = () => {
  const { role } = useContext(AuthContext);
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState(location.pathname);
  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const isAdmin = role === "admin";
  const isFootballManager = role === "football_manager";

  useEffect(() => {
    setSelectedMenuItem(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (isAdmin) {
      setMenuItems([
        { key: "/admins", label: "Home", icon: <HomeOutlined /> },
        { key: "/admins/users", label: "Users", icon: <TeamOutlined /> },
        {
          key: "/admins/footballers",
          label: "Footballers",
          icon: <FaPersonRunning />,
        },
        {
          key: "/admins/transfers",
          label: "Transfers",
          icon: <MdTransferWithinAStation />,
        },
        { key: "/admins/clubs", label: "Clubs", icon: <ShopOutlined /> },
        {
          key: "/admins/agents",
          label: "Agents",
          icon: <UserSwitchOutlined />,
        },
        { key: "/admins/news", label: "News", icon: <ReadOutlined /> },
        {
          key: "/admins/statistics",
          label: "Statistics",
          icon: <BarChartOutlined />,
        },
      ]);
    } else if (isFootballManager) {
      setMenuItems([
        { key: "/admins", label: "Home", icon: <HomeOutlined /> },
        {
          key: "/admins/footballers",
          label: "Footballers",
          icon: <FaPersonRunning />,
        },
        {
          key: "/admins/transfers",
          label: "Transfers",
          icon: <MdTransferWithinAStation />,
        },
        { key: "/admins/clubs", label: "Clubs", icon: <ShopOutlined /> },
        {
          key: "/admins/agents",
          label: "Agents",
          icon: <UserSwitchOutlined />,
        },
      ]);
    }
  }, [role]);

  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["/admins"]}
          selectedKeys={[selectedMenuItem]}
        >
          {menuItems.map((menuItem) => (
            <Menu.Item key={menuItem.key} icon={menuItem.icon}>
              <Link to={menuItem.key}>{menuItem.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    </>
  );
};

export default AdminMenu;
