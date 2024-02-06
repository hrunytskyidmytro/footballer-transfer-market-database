import React from "react";
import { Link } from "react-router-dom";
import { Space } from "antd";

import "./UserItem.css";

const UserItem = (props) => {
  return (
    <Space direction="vertical">
      {/* <Link to={`/${props.id}/footballers`}>{props.name}</Link> */}
      <span>{props.name}</span>
      <span>{props.email}</span>
      <span>{props.role}</span>
      <span>{props.footballerCount}</span>
    </Space>
  );
};

export default UserItem;
