import React from "react";
import { Row, Col, Card, Statistic, Tag } from "antd";

const AdditionalFeatures = ({ featuresHovered }) => (
  <div
    style={{
      transition: "opacity 0.5s",
      opacity: featuresHovered ? 1 : 0,
      display: featuresHovered ? "block" : "none",
    }}
  >
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={12}>
        <Card style={{ height: "100%" }}>
          <Statistic title="Users" value={1000000} />
        </Card>
      </Col>
      <Col xs={24} sm={24} md={12}>
        <Card style={{ height: "100%", paddingTop: "25px" }}>
          <Tag color="#1890ff">Football</Tag>
          <Tag color="#1890ff">Web Development</Tag>
          <Tag color="#1890ff">Data Analytics</Tag>
        </Card>
      </Col>
    </Row>
  </div>
);

export default AdditionalFeatures;
