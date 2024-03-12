import React from "react";
import { Timeline } from "antd";

const MilestonesTimeline = ({ milestonesHovered }) => (
  <Timeline
    style={{
      transition: "opacity 0.5s",
      opacity: milestonesHovered ? 1 : 0,
      display: milestonesHovered ? "block" : "none",
    }}
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
);

export default MilestonesTimeline;
