import React from "react";
import { Card, Typography } from "antd";
import moment from "moment";

const NewsCard = ({ news }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card
        title={news.title}
        style={{ width: 600, marginTop: 20 }}
        cover={
          <img alt={news.title} src={`http://localhost:5001/${news.image}`} />
        }
      >
        <Card.Meta
          title={
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Date publication: {moment(news.date).format("MMMM Do YYYY")}
            </Typography.Title>
          }
          description={
            <Typography.Paragraph style={{ marginTop: 10 }}>
              {news.description}
            </Typography.Paragraph>
          }
        />
      </Card>
    </div>
  );
};

export default NewsCard;
