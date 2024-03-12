import React from "react";
import { List, Typography, Divider, Image } from "antd";
import moment from "moment";

const TransferItem = ({ transfer }) => {
  return (
    <List.Item style={{ padding: "16px 0" }}>
      <List.Item.Meta
        title={
          <Typography.Text strong>
            {moment(transfer.date).format("MMMM Do YYYY")}
          </Typography.Text>
        }
        description={
          <>
            <Typography.Text strong>{`From: `}</Typography.Text>
            <Typography.Text>
              <Image
                src={`http://localhost:5001/${transfer.fromClub.image}`}
                alt={`${transfer.fromClub.name}`}
                preview={false}
                style={{ maxWidth: "25px" }}
              />{" "}
              {transfer.fromClub.name}
            </Typography.Text>
            <Typography.Text strong style={{ marginLeft: 8, marginRight: 8 }}>
              {" - "}
            </Typography.Text>
            <Typography.Text strong>{`To: `}</Typography.Text>
            <Typography.Text>
              <Image
                src={`http://localhost:5001/${transfer.toClub.image}`}
                alt={`${transfer.toClub.name}`}
                preview={false}
                style={{ maxWidth: "25px" }}
              />{" "}
              {transfer.toClub.name}
            </Typography.Text>
          </>
        }
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Divider type="vertical" style={{ margin: "0 8px" }} />
        <Typography.Text strong>Transfer Fee:</Typography.Text>
        <Typography.Text
          style={{ marginLeft: 8, marginRight: 8 }}
        >{`${transfer.transferFee
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} €`}</Typography.Text>
        <Divider type="vertical" style={{ margin: "0 8px" }} />
        <Typography.Text strong>Compensation:</Typography.Text>
        <Typography.Text
          style={{ marginLeft: 8, marginRight: 8 }}
        >{`${transfer.compensationAmount
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} €`}</Typography.Text>
        <Divider type="vertical" style={{ margin: "0 8px" }} />
        <Typography.Text strong>Season:</Typography.Text>
        <Typography.Text style={{ marginLeft: 8 }}>
          {transfer.season}
        </Typography.Text>
      </div>
    </List.Item>
  );
};

export default TransferItem;
