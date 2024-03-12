import React from "react";
import { Descriptions } from "antd";

const ClubInfoDetails = ({ club }) => {
  return (
    <div style={{ width: "60%", marginLeft: "20px" }}>
      <Descriptions title={club.name} bordered column={1}>
        <Descriptions.Item label="Description" style={{ textAlign: "left" }}>
          {club.description}
        </Descriptions.Item>
        <Descriptions.Item label="Country">{club.country}</Descriptions.Item>
        <Descriptions.Item label="Cost">
          {club.cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} €
        </Descriptions.Item>
        <Descriptions.Item label="Foundation year">
          {club.foundationYear}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ClubInfoDetails;
