import React, { useContext } from "react";
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
  StarOutlined,
} from "@ant-design/icons";

import { AuthContext } from "../../../shared/context/auth-context";

const { Title, Paragraph } = Typography;

const AdminHome = ({
  numUsers,
  numFootballers,
  numTransfers,
  numClubs,
  numAgents,
  numNews,
  numRatings,
}) => {
  const { user, role } = useContext(AuthContext);

  const isAdmin = role === "admin";
  const isFootballManager = role === "football_manager";

  return (
    <>
      <div style={{ padding: "20px" }}>
        <Title level={2}>
          {`Welcome to Admin Panel, ${user.name || "Unknown"}!`}
        </Title>
        <Paragraph>
          Manage your website content efficiently with our powerful admin tools.
        </Paragraph>
        <br />
        <br />
        <Row gutter={[16, 16]} justify="center">
          {isAdmin && (
            <>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Link to="/admins/users">
                  <Card hoverable>
                    <UserOutlined
                      style={{
                        fontSize: "36px",
                      }}
                    />
                    <Title level={3}>{numUsers || 0}</Title>
                    <Title level={4}>Manage Users</Title>
                    <Paragraph>View, edit, and manage user accounts.</Paragraph>
                  </Card>
                </Link>
              </Col>
            </>
          )}
          {(isAdmin || isFootballManager) && (
            <>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Link to="/admins/footballers">
                  <Card hoverable>
                    <GlobalOutlined
                      style={{
                        fontSize: "36px",
                      }}
                    />
                    <Title level={3}>{numFootballers || 0}</Title>
                    <Title level={4}>Manage Footballers</Title>
                    <Paragraph>View, edit, and manage footballers.</Paragraph>
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Link to="/admins/transfers">
                  <Card hoverable>
                    <DollarOutlined
                      style={{
                        fontSize: "36px",
                      }}
                    />
                    <Title level={3}>{numTransfers || 0}</Title>
                    <Title level={4}>Manage Transfers</Title>
                    <Paragraph>View, edit, and manage transfers.</Paragraph>
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Link to="/admins/clubs">
                  <Card hoverable>
                    <ShopOutlined
                      style={{
                        fontSize: "36px",
                      }}
                    />
                    <Title level={3}>{numClubs || 0}</Title>
                    <Title level={4}>Manage Clubs</Title>
                    <Paragraph>View, edit, and manage clubs.</Paragraph>
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Link to="/admins/agents">
                  <Card hoverable>
                    <UserSwitchOutlined
                      style={{
                        fontSize: "36px",
                      }}
                    />
                    <Title level={3}>{numAgents || 0}</Title>
                    <Title level={4}>Manage Agents</Title>
                    <Paragraph>View, edit, and manage agents.</Paragraph>
                  </Card>
                </Link>
              </Col>
            </>
          )}
          {isAdmin && (
            <>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Link to="/admins/news">
                  <Card hoverable>
                    <SwitcherOutlined
                      style={{
                        fontSize: "36px",
                      }}
                    />
                    <Title level={3}>{numNews || 0}</Title>
                    <Title level={4}>Manage News</Title>
                    <Paragraph>View, edit, and manage news.</Paragraph>
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Link to="/admins/ratings">
                  <Card hoverable>
                    <StarOutlined
                      style={{
                        fontSize: "36px",
                      }}
                    />
                    <Title level={3}>{numRatings || 0}</Title>
                    <Title level={4}>Manage Ratings</Title>
                    <Paragraph>View, edit, and manage ratings.</Paragraph>
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Link to="/admins/statistics">
                  <Card hoverable>
                    <LineChartOutlined
                      style={{
                        fontSize: "36px",
                      }}
                    />
                    <Title level={4}>Manage Statistics</Title>
                    <Paragraph>View, edit, and manage statistics.</Paragraph>
                  </Card>
                </Link>
              </Col>
            </>
          )}
        </Row>
      </div>
    </>
  );
};

export default AdminHome;
