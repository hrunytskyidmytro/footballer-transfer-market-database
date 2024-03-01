import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Spin, Image, Typography } from "antd";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Footballers = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedFootballers, setLoadedFootballers] = useState();

  useEffect(() => {
    const fetchFootballers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/footballers/"
        );

        setLoadedFootballers(responseData.footballers);
      } catch (err) {}
    };
    fetchFootballers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <Spin size="large" />
        </div>
      )}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {!isLoading &&
          loadedFootballers &&
          loadedFootballers.map((footballer) => (
            <Link to={`/footballers/${footballer.id}`} key={footballer.id}>
              <Card
                key={footballer.id}
                hoverable
                style={{ width: 200, margin: 20 }}
                cover={
                  <img
                    alt={`${footballer.name} ${footballer.surname}`}
                    src={`http://localhost:5001/${footballer.image}`}
                  />
                }
              >
                <Card.Meta
                  title={`${footballer.name} ${footballer.surname}`}
                  description={
                    <Typography.Title level={4}>
                      <Image
                        width={50}
                        src={`http://localhost:5001/${footballer.club.image}`}
                        preview={false}
                      />
                    </Typography.Title>
                  }
                />
              </Card>
            </Link>
          ))}
      </div>
    </React.Fragment>
  );
};

export default Footballers;
