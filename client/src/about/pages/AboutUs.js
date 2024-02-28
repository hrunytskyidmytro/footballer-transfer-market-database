import React from "react";
import {
  Typography,
  Divider,
  Row,
  Col,
  Card,
  Avatar,
  Space,
  Tooltip,
  Watermark,
  Statistic,
  Tag,
  Timeline,
  Collapse,
} from "antd";
import {
  GithubOutlined,
  LinkedinOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const AboutMe = () => {
  const myInfo = {
    name: "Dmytro Hrunytskyi",
    role: "Web Developer",
    avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=3",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    additionalLink: "https://your_additional_link.com/",
    address: "87 Main Street, Kyiv, Ukraine",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d17258732.227831736!2d29.648354603056725!3d48.37943312348909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c4d62257d369fb%3A0x7eef00e74230f3f!2sUkraine!5e0!3m2!1sen!2suk!4v1646647038697!5m2!1sen!2suk",
    history: `Transfer Market is the leading platform for football fans, players and clubs. Founded in 2024 by a passionate developer and football fans, Transfer Market aims to provide comprehensive information on football transfers around the world.
            Our journey began with a simple idea: to create a centralised hub for all transfer activity in the football world. Over time, we plan to grow into a trusted source of transfer news, statistics and analytics that will serve millions of users around the world.
            At Transfer Market, we believe that data-driven information will empower football fans and professionals alike. The team works tirelessly to collect data, analyse trends and provide timely reports to keep our users informed and engaged.
            Whether you're a fan looking for the latest transfer rumours, a player looking for opportunities or a club manager planning your next signing, Transfer Market has everything you need to stay ahead in the dynamic world of football transfers.`,
    usefulness: [
      "Comprehensive Transfer News: Stay updated with the latest transfer rumors, confirmed deals, and player movements from around the world.",
      "Player Profiles: Explore detailed profiles of football players, including their career stats, transfer history, and market value.",
      "Club Information: Get insights into football clubs, including their squad, transfer budget, and recent signings.",
      "Agent Information: Get insights into football agents.",
      "Transfer Analysis: Dive deep into transfer trends, market dynamics, and player valuation with our analytical reports and insights.",
    ],
  };

  return (
    <Watermark content="About Us">
      <div
        style={{
          padding: "20px",
        }}
      >
        <Title level={2}>About Me</Title>
        <Divider />
        <Paragraph style={{ fontSize: "14px" }}>
          Hi, there! I'm {myInfo.name}, a passionate web developer and football
          enthusiast. Welcome to my corner of the internet, where I share my
          love for coding and football.
        </Paragraph>
        <Paragraph style={{ fontSize: "14px" }}>
          As a dedicated developer, I strive to create engaging and
          user-friendly web experiences that resonate with my audience. Whether
          you're here to explore the world of football transfers or learn about
          the latest web development trends, I've got you covered.
        </Paragraph>
        <Divider />
        <Title level={3}>My Information</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Card>
              <Space direction="vertical" align="center">
                <Avatar size={64} src={myInfo.avatar} icon={<UserOutlined />} />
                <Title level={4}>{myInfo.name}</Title>
                <Paragraph style={{ fontSize: "14px" }}>
                  {myInfo.role}
                </Paragraph>
                <div>
                  <Tooltip title="LinkedIn">
                    <a
                      href={myInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedinOutlined
                        style={{ fontSize: "20px", marginRight: "10px" }}
                      />
                    </a>
                  </Tooltip>
                  <Tooltip title="GitHub">
                    <a
                      href={myInfo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GithubOutlined style={{ fontSize: "20px" }} />
                    </a>
                  </Tooltip>
                  <Tooltip title="Additional Link">
                    <a
                      href={myInfo.additionalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/your_additional_icon.png"
                        alt="Additional Link"
                        style={{ width: "20px", marginLeft: "10px" }}
                      />
                    </a>
                  </Tooltip>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Card>
              <Space direction="vertical">
                <Title level={4}>Address</Title>
                <Paragraph style={{ fontSize: "14px" }}>
                  {myInfo.address}
                </Paragraph>
                <iframe
                  title="Map"
                  src={myInfo.mapUrl}
                  width="100%"
                  height="250"
                  style={{ border: "0" }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </Space>
            </Card>
          </Col>
        </Row>
        <Divider />
        <Title level={3} style={{ padding: 15 }}>
          History of Transfer Market🔥🔥🔥
        </Title>
        <Paragraph
          style={{
            fontSize: "14px",
            textAlign: "justify",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {myInfo.history}
        </Paragraph>
        <Divider />
        <Title level={3} style={{ padding: 15 }}>
          Why Transfer Market is Useful?
        </Title>
        <Paragraph
          style={{
            fontSize: "14px",
          }}
        >
          <Paragraph
            style={{
              fontSize: "14px",
            }}
          >
            <Typography.Text keyboard>Transfer Market</Typography.Text> offers a
            wide range of features and services to cater to the diverse needs of
            our users. Here are some key aspects that make Transfer Market a
            valuable resource:
          </Paragraph>
          {myInfo.usefulness.map((point, index) => (
            <Paragraph
              key={index}
              style={{
                fontSize: "14px",
              }}
            >
              <Typography.Text strong>{index + 1}</Typography.Text>. {point}
            </Paragraph>
          ))}
        </Paragraph>
        <Divider />
        <Paragraph
          style={{
            fontSize: "14px",
          }}
        >
          This project was built using Ant Design, a popular React UI library
          known for its extensive set of components and sleek design. Ant Design
          played a crucial role in creating the modern and visually appealing
          user interface of Transfer Market.
        </Paragraph>

        <Divider />
        <Title level={3} style={{ padding: 15 }}>
          Additional Features
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Card>
              <Statistic title="Users" value={1000000} />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Card>
              <Tag color="blue">Football</Tag>
              <Tag color="green">Web Development</Tag>
              <Tag color="orange">Data Analytics</Tag>
            </Card>
          </Col>
        </Row>
        <Divider />
        <Title level={3} style={{ padding: 15 }}>
          Milestones
        </Title>
        <Timeline
          mode={"left"}
          items={[
            {
              children: "Project Initiated (2024)",
              color: "green",
            },
            {
              children: "First Beta Release (2025)",
              color: "green",
            },
            {
              children: "Reached 100,000 Users (2026)",
              color: "orange",
            },
            {
              children: "Expanded to International Market (2027)",
              color: "orange",
            },
            {
              children: "Acquired by Major Sports Network (2028)",
              color: "red",
            },
          ]}
        />
        <Divider />
        <Title level={3} style={{ padding: 15 }}>
          More Information
        </Title>
        <Collapse
          items={[
            {
              key: "1",
              label: "Privacy Policy",
              children: (
                <p>
                  This project respects user privacy and adheres to strict data
                  protection regulations.
                </p>
              ),
            },
            {
              key: "2",
              label: "Terms of Service",
              children: (
                <p>
                  By using this platform, you agree to abide by our terms and
                  conditions.
                </p>
              ),
            },
          ]}
        />
      </div>
    </Watermark>
  );
};

export default AboutMe;
