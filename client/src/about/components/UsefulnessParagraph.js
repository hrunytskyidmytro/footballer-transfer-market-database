import React from "react";
import { Typography } from "antd";

const { Paragraph } = Typography;

const UsefulnessParagraph = ({ usefulness, usefulnessHovered }) => (
  <Paragraph style={{ fontSize: "16px", color: "#1890ff" }}>
    {usefulness.map((point, index) => (
      <Paragraph
        key={index}
        style={{
          fontSize: "16px",
          transition: "opacity 0.5s",
          opacity: usefulnessHovered ? 1 : 0,
          display: usefulnessHovered ? "block" : "none",
        }}
      >
        <b>{index + 1}</b>. {point}
      </Paragraph>
    ))}
  </Paragraph>
);

export default UsefulnessParagraph;
