import React from "react";
import { Card, Space, Avatar, Tooltip, Typography } from "antd";
import {
  GithubOutlined,
  LinkedinOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const ContactLinks = ({ linkedin, github, additionalLink }) => (
  <div>
    <Tooltip title="LinkedIn">
      <a href={linkedin} target="_blank" rel="noopener noreferrer">
        <LinkedinOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
      </a>
    </Tooltip>
    <br />
    <br />
    <Tooltip title="GitHub">
      <a href={github} target="_blank" rel="noopener noreferrer">
        <GithubOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
      </a>
    </Tooltip>
    <br />
    <br />
    <Tooltip title="Additional Link">
      <a href={additionalLink} target="_blank" rel="noopener noreferrer">
        <img
          src="/your_additional_icon.png"
          alt="Additional Link"
          style={{ width: "24px", marginLeft: "10px" }}
        />
      </a>
    </Tooltip>
  </div>
);

const UserInfoCard = ({
  name,
  avatar,
  role,
  linkedin,
  github,
  additionalLink,
}) => (
  <Card style={{ height: "100%" }} hoverable>
    <Space direction="vertical" align="center">
      <Avatar size={64} src={avatar} icon={<UserOutlined />} />
      <Title level={4}>{name}</Title>
      <Paragraph style={{ fontSize: "16px" }}>{role}</Paragraph>
      <ContactLinks
        linkedin={linkedin}
        github={github}
        additionalLink={additionalLink}
      />
    </Space>
  </Card>
);

export default UserInfoCard;
