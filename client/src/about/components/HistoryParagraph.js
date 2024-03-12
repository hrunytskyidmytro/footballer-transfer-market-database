import React from "react";
import { Typography } from "antd";

const { Paragraph } = Typography;

const HistoryParagraph = ({ historyText, historyHovered }) => (
  <Paragraph
    style={{
      fontSize: "16px",
      textAlign: "justify",
      maxWidth: "1000px",
      margin: "0 auto",
      opacity: historyHovered ? 1 : 0,
      transition: "opacity 0.5s",
      display: historyHovered ? "block" : "none",
    }}
  >
    {historyText}
  </Paragraph>
);

export default HistoryParagraph;
