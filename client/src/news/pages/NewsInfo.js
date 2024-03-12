import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";

import NewsCard from "../components/NewsCard";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const NewsInfo = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedNews, setLoadedNews] = useState();
  const { newsId } = useParams();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/news/${newsId}`
        );

        setLoadedNews(responseData.n);
      } catch (err) {}
    };
    fetchNews();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <Spin size="large" />
        </div>
      )}
      {loadedNews && <NewsCard news={loadedNews} />}
    </>
  );
};

export default NewsInfo;
