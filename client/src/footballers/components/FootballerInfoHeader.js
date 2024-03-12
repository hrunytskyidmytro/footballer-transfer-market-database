import React from "react";
import { Row, Col, Image } from "antd";

const FootballerInfoHeader = ({ image, name }) => {
  return (
    <Row justify="center">
      <Col span={24} style={{ textAlign: "center" }}>
        <Image
          src={image}
          alt={name}
          style={{ maxWidth: "200px", borderRadius: 20 }}
        />
      </Col>
    </Row>
  );
};

export default FootballerInfoHeader;
