import React, { useEffect, useState } from "react";
import { Button, Card, Flex, Typography, Spin } from "antd";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Clubs = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedNews, setLoadedNews] = useState();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/news/"
        );
        setLoadedNews(responseData.news);
      } catch (err) {}
    };
    fetchNews();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <Spin size="large" />}
      <Flex wrap="wrap" justify="center">
        {!isLoading &&
          loadedNews &&
          loadedNews.map((news) => (
            <Card
              key={news.id}
              hoverable
              style={{ width: 950, margin: 5 }}
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
                    href={`news/${news.id}`}
                    key={news.id}
                    // target="_blank"
                    style={{ marginTop: 16 }}
                  >
                    Read more
                  </Button>
                </Flex>
              </Flex>
            </Card>
          ))}
      </Flex>
    </React.Fragment>
  );
};

export default Clubs;
