import React, { useState } from "react";
import { Typography, Divider, Row, Col } from "antd";
import UserInfoCard from "../components/UserInfoCard";
import AddressCard from "../components/AddressCard";
import HistoryParagraph from "../components/HistoryParagraph";
import UsefulnessParagraph from "../components/UsefulnessParagraph";
import AdditionalFeatures from "../components/AdditionalFeatures";
import MilestonesTimeline from "../components/MilestonesTimeline";
import MoreInformationCollapse from "../components/MoreInformationCollapse";

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

  const [historyHovered, setHistoryHovered] = useState(false);
  const [usefulnessHovered, setUsefulnessHovered] = useState(false);
  const [featuresHovered, setFeaturesHovered] = useState(false);
  const [milestonesHovered, setMilestonesHovered] = useState(false);

  const toggleHistoryHover = () => {
    setHistoryHovered(!historyHovered);
  };

  const toggleUsefulnessHover = () => {
    setUsefulnessHovered(!usefulnessHovered);
  };

  const toggleFeaturesHover = () => {
    setFeaturesHovered(!featuresHovered);
  };

  const toggleMilestonesHover = () => {
    setMilestonesHovered(!milestonesHovered);
  };

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <Title level={2} style={{ color: "#1890ff", textAlign: "center" }}>
        About Me
      </Title>
      <Divider />
      <Paragraph style={{ fontSize: "16px" }}>
        Hi, there! I'm {myInfo.name}, a passionate web developer and football
        enthusiast. Welcome to my corner of the internet, where I share my love
        for coding and football.
      </Paragraph>
      <Paragraph style={{ fontSize: "16px" }}>
        As a dedicated developer, I strive to create engaging and user-friendly
        web experiences that resonate with my audience. Whether you're here to
        explore the world of football transfers or learn about the latest web
        development trends, I've got you covered.
      </Paragraph>
      <Divider />
      <Title level={3} style={{ color: "#1890ff" }}>
        My Information
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12}>
          <UserInfoCard {...myInfo} />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <AddressCard {...myInfo} />
        </Col>
      </Row>
      <Divider />
      <Title level={3} style={{ color: "#1890ff", padding: 15 }}>
        <span
          onMouseEnter={toggleHistoryHover}
          onMouseLeave={toggleHistoryHover}
          style={{ cursor: "pointer" }}
        >
          History of Transfer Market🔥🔥🔥
        </span>
      </Title>
      <HistoryParagraph
        historyText={myInfo.history}
        historyHovered={historyHovered}
      />
      <Divider />
      <Title level={3} style={{ color: "#1890ff", padding: 15 }}>
        <span
          onMouseEnter={toggleUsefulnessHover}
          onMouseLeave={toggleUsefulnessHover}
          style={{ cursor: "pointer" }}
        >
          Why Transfer Market is Useful?
        </span>
      </Title>
      <UsefulnessParagraph
        usefulness={myInfo.usefulness}
        usefulnessHovered={usefulnessHovered}
      />
      <Divider />
      <Title level={3} style={{ color: "#1890ff", padding: 15 }}>
        <span
          onMouseEnter={toggleFeaturesHover}
          onMouseLeave={toggleFeaturesHover}
          style={{ cursor: "pointer" }}
        >
          Additional Features
        </span>
      </Title>
      <AdditionalFeatures featuresHovered={featuresHovered} />
      <Divider />
      <Title level={3} style={{ color: "#1890ff", padding: 15 }}>
        <span
          onMouseEnter={toggleMilestonesHover}
          onMouseLeave={toggleMilestonesHover}
          style={{ cursor: "pointer" }}
        >
          Milestones
        </span>
      </Title>
      <MilestonesTimeline milestonesHovered={milestonesHovered} />
      <Divider />
      <Title level={3} style={{ color: "#1890ff", padding: 15 }}>
        More Information
      </Title>
      <MoreInformationCollapse />
      <Divider />
      <Paragraph
        style={{
          fontSize: "16px",
        }}
      >
        This project was built using{" "}
        <a href="https://ant.design/" target="_blank" rel="noopener noreferrer">
          Ant Design
        </a>
        , a popular React UI library known for its extensive set of components
        and sleek design. Ant Design played a crucial role in creating the
        modern and visually appealing user interface of Transfer Market
      </Paragraph>
    </div>
  );
};

export default AboutMe;
