import React, { useState, useEffect } from "react";
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

const { Sider } = Layout;

const AdminMenu = () => {
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState(location.pathname);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setSelectedMenuItem(location.pathname);
  }, [location.pathname]);

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
          <Menu.Item key="/admins" icon={<HomeOutlined />}>
            <Link to="/admins">Home</Link>
          </Menu.Item>
          <Menu.Item key="/admins/users" icon={<TeamOutlined />}>
            <Link to="/admins/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="/admins/footballers" icon={<FaPersonRunning />}>
            <Link to="/admins/footballers">Footballers</Link>
          </Menu.Item>
          <Menu.Item
            key="/admins/transfers"
            icon={<MdTransferWithinAStation />}
          >
            <Link to="/admins/transfers">Transfers</Link>
          </Menu.Item>
          <Menu.Item key="/admins/clubs" icon={<ShopOutlined />}>
            <Link to="/admins/clubs">Clubs</Link>
          </Menu.Item>
          <Menu.Item key="/admins/agents" icon={<UserSwitchOutlined />}>
            <Link to="/admins/agents">Agents</Link>
          </Menu.Item>
          <Menu.Item key="/admins/news" icon={<ReadOutlined />}>
            <Link to="/admins/news">News</Link>
          </Menu.Item>
          <Menu.Item key="/admins/statistics" icon={<BarChartOutlined />}>
            <Link to="/admins/statistics">Statistics</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    </>
  );
};

export default AdminMenu;
