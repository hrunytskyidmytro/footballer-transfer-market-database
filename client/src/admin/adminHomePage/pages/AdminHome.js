import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Typography, Row, Col, Card } from "antd";
import {
  UserOutlined,
  DollarOutlined,
  LineChartOutlined,
  ShopOutlined,
  UserSwitchOutlined,
  SwitcherOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const { Title, Paragraph } = Typography;

const AdminHome = () => {
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
      <div style={{ padding: "20px" }}>
        <Title level={2}>
          {loadedUser.name
            ? `Welcome to Admin Panel, ${loadedUser.name}!`
            : "Welcome to Admin Panel, Unknown!"}
        </Title>
        <Paragraph>
          Manage your website content efficiently with our powerful admin tools.
        </Paragraph>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link to="/admins/users">
              <Card hoverable>
                <UserOutlined
                  style={{ fontSize: "36px", marginBottom: "10px" }}
                />
                <Title level={4}>Manage Users</Title>
                <Paragraph>View, edit, and manage user accounts.</Paragraph>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link to="/admins/footballers">
              <Card hoverable>
                <GlobalOutlined
                  style={{ fontSize: "36px", marginBottom: "10px" }}
                />
                <Title level={4}>Manage Footballers</Title>
                <Paragraph>View, edit, and manage footballers.</Paragraph>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link to="/admins/transfers">
              <Card hoverable>
                <DollarOutlined
                  style={{ fontSize: "36px", marginBottom: "10px" }}
                />
                <Title level={4}>Manage Transfers</Title>
                <Paragraph>View, edit, and manage transfers.</Paragraph>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link to="/admins/clubs">
              <Card hoverable>
                <ShopOutlined
                  style={{ fontSize: "36px", marginBottom: "10px" }}
                />
                <Title level={4}>Manage Clubs</Title>
                <Paragraph>View, edit, and manage clubs.</Paragraph>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link to="/admins/agents">
              <Card hoverable>
                <UserSwitchOutlined
                  style={{ fontSize: "36px", marginBottom: "10px" }}
                />
                <Title level={4}>Manage Agents</Title>
                <Paragraph>View, edit, and manage agents.</Paragraph>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link to="/admins/news">
              <Card hoverable>
                <SwitcherOutlined
                  style={{ fontSize: "36px", marginBottom: "10px" }}
                />
                <Title level={4}>Manage News</Title>
                <Paragraph>View, edit, and manage news.</Paragraph>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link to="/admins/statistics">
              <Card hoverable>
                <LineChartOutlined
                  style={{ fontSize: "36px", marginBottom: "10px" }}
                />
                <Title level={4}>Manage Statistics</Title>
                <Paragraph>View, edit, and manage statistics.</Paragraph>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AdminHome;
