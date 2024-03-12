import React from "react";
import { Card, Avatar, Typography } from "antd";

const AgentCard = ({ agent, showModal }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card title={`${agent.name} ${agent.surname}`} style={{ width: 500 }}>
        <Card.Meta
          avatar={
            <Avatar
              size={64}
              src={`http://localhost:5001/${agent.image}`}
              alt={`${agent.name} ${agent.surname}`}
              onClick={showModal}
              style={{ cursor: "pointer" }}
            />
          }
          description={
            <div>
              <Typography.Paragraph
                type="secondary"
                style={{ textAlign: "left" }}
                copyable
              >
                {agent.email}
              </Typography.Paragraph>
              <Typography.Paragraph
                type="secondary"
                style={{ textAlign: "left" }}
              >
                Phone number: +380-{agent.phoneNumber}
              </Typography.Paragraph>
              <Typography.Paragraph
                type="secondary"
                style={{ textAlign: "left" }}
              >
                Description: {agent.description}
              </Typography.Paragraph>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default AgentCard;
