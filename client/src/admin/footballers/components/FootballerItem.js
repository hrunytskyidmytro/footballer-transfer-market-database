import React from "react";
import { Link } from "react-router-dom";
import { Space } from "antd";

import "./UserItem.css";

const FootballerItem = (props) => {
  return (
    <Space direction="vertical">
      {/* <Link to={`/${props.id}/footballers`}>{props.name}</Link> */}
      <span>{props.name}</span>
      <span>{props.nationality}</span>
      <span>{props.birthDate}</span>
      <span>{props.position}</span>
      <span>{props.image}</span>
      <span>{props.clubs}</span>
      <span>{props.transfers}</span>
    </Space>
  );
};

export default FootballerItem;