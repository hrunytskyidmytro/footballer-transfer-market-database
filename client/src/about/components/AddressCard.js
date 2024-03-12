import React from "react";
import { Card, Space, Typography } from "antd";

const { Title, Paragraph } = Typography;

const AddressCard = ({ address, mapUrl }) => (
  <Card style={{ height: "100%" }} hoverable>
    <Space direction="vertical">
      <Title level={4}>Address</Title>
      <Paragraph style={{ fontSize: "16px" }}>{address}</Paragraph>
      <iframe
        title="Map"
        src={mapUrl}
        width="100%"
        height="250"
        style={{ border: "0" }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </Space>
  </Card>
);

export default AddressCard;
