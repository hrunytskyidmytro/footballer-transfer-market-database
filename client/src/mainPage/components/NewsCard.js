import React from "react";
import { Card, Typography, Button, Flex } from "antd";

const NewsCard = ({ news }) => {
  return (
    <Card
      key={news.id}
      hoverable
      style={{ width: 950, margin: 10 }}
      styles={{
        body: {
          padding: 0,
          overflow: "hidden",
        },
      }}
    >
      <Flex justify="space-between">
        <img
          alt={news.name}
          src={`http://localhost:5001/${news.image}`}
          style={{ display: "block", width: 400 }}
        />
        <Flex
          vertical
          align="flex-end"
          justify="space-between"
          style={{
            padding: 32,
          }}
        >
          <Typography.Title level={3} style={{ marginTop: 16 }}>
            “{news.title}.”
          </Typography.Title>
          <Button
            type="primary"
            href={`/news/${news.id}`}
            key={news.id}
            style={{ marginTop: 16 }}
          >
            Read more
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default NewsCard;
