import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import moment from "moment";

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
        console.log(responseData.n);
      } catch (err) {}
    };
    fetchNews();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <Spin size="large" />
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {loadedNews && (
          <article>
            <p>
              <img
                alt={loadedNews.title}
                src={`http://localhost:5001/${loadedNews.image}`}
              />
            </p>
            <h2>{loadedNews.title}</h2>
            <p>
              Date publication: {moment(loadedNews.date).format("MMMM Do YYYY")}
            </p>
            <p>Description: {loadedNews.description}</p>
          </article>
        )}
      </div>
    </React.Fragment>
  );
};

export default NewsInfo;
