import React, { useState, useEffect } from "react";
import { Carousel, Typography, Row, Col, Divider, Flex, Spin } from "antd";

import FootballerCard from "../components/FootballerCard";
import NewsCard from "../components/NewsCard";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const { Title } = Typography;

const HomePage = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [mostExpensiveFootballers, setMostExpensiveFootballers] = useState([]);
  const [youngestFootballers, setYoungestFootballers] = useState([]);
  const [oldestFootballers, setOldestFootballers] = useState([]);
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    const fetchExpensiveFootballers = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/footballers/expensive"
        );

        setMostExpensiveFootballers(response.footballers);
      } catch (err) {}
    };
    fetchExpensiveFootballers();
  }, [sendRequest]);

  useEffect(() => {
    const fetchYoungestFootballers = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/footballers/youngest"
        );

        setYoungestFootballers(response.footballers);
      } catch (err) {}
    };
    fetchYoungestFootballers();
  }, [sendRequest]);

  useEffect(() => {
    const fetchOldestFootballers = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/footballers/oldest"
        );

        setOldestFootballers(response.footballers);
      } catch (err) {}
    };
    fetchOldestFootballers();
  }, [sendRequest]);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/news/latest"
        );

        setLatestNews(response.news);
      } catch (err) {}
    };
    fetchLatestNews();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <Spin size="large" />
        </div>
      )}
      <br />
      <div style={{ textAlign: "center" }}>
        <Title level={2}>Welcome to our football portal!</Title>
        <p>
          Explore the latest news, discover the most expensive and youngest
          footballers, and stay up-to-date with the football world.
        </p>
      </div>
      <br />
      <div style={{ padding: "20px" }}>
        <div style={{ width: "50%", margin: "auto" }}>
          <Carousel autoplay>
            <div>
              <img
                src="https://static.ua-football.com/img/upload/21/2b4356.jpeg"
                alt="Players 1"
                style={{ width: "100%", borderRadius: 20 }}
              />
            </div>
            <div>
              <img
                src="https://img.footballhub.ua/2024/03/gettyimages2076506198-1.webp"
                alt="Players 2"
                style={{ width: "100%", borderRadius: 20 }}
              />
            </div>
            <div>
              <img
                src="https://img.championat.com/news/big/f/b/al-nasr-al-ajn-4-3-pen-1-3_17101974721010284450.jpg"
                alt="Players 3"
                style={{ width: "100%", borderRadius: 20 }}
              />
            </div>
            <div>
              <img
                src="https://img.footballhub.ua/2024/03/336873246_1140354116637140_141890733439383037_n.webp"
                alt="Players 4"
                style={{ width: "100%", borderRadius: 20 }}
              />
            </div>
          </Carousel>
        </div>
        <br />
        <Title level={2} style={{ marginTop: "20px", textAlign: "center" }}>
          Oldest footballers
        </Title>
        <Divider />
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Row gutter={[48, 48]}>
            {!isLoading &&
              oldestFootballers &&
              oldestFootballers.map((footballer) => (
                <Col key={footballer.id} xs={24} sm={12} md={8}>
                  <FootballerCard key={footballer.id} footballer={footballer} />
                </Col>
              ))}
          </Row>
        </div>
        <Title level={2} style={{ marginTop: "20px", textAlign: "center" }}>
          Youngest footballers
        </Title>
        <Divider />
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Row gutter={[48, 48]}>
            {!isLoading &&
              youngestFootballers &&
              youngestFootballers.map((footballer) => (
                <Col key={footballer.id} xs={24} sm={12} md={8}>
                  <FootballerCard key={footballer.id} footballer={footballer} />
                </Col>
              ))}
          </Row>
        </div>
        <Title level={2} style={{ marginTop: "20px", textAlign: "center" }}>
          Most expensive footballers
        </Title>
        <Divider />
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Row gutter={[48, 48]}>
            {!isLoading &&
              mostExpensiveFootballers &&
              mostExpensiveFootballers.map((footballer) => (
                <Col key={footballer.id} xs={24} sm={12} md={8}>
                  <FootballerCard key={footballer.id} footballer={footballer} />
                </Col>
              ))}
          </Row>
        </div>
        <Title level={2} style={{ marginTop: "20px", textAlign: "center" }}>
          Latest news
        </Title>
        <Divider />
        <Flex wrap="wrap" justify="center">
          {!isLoading &&
            latestNews &&
            latestNews.map((news) => <NewsCard key={news.id} news={news} />)}
        </Flex>
      </div>
    </>
  );
};

export default HomePage;
