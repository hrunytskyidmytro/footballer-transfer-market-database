import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Spin } from "antd";

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
      <div style={{ display: "flex", flexWrap: "wrap" }}>
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
                  description={`Nationality: ${footballer.nationality}`}
                />
              </Card>
            </Link>
          ))}
      </div>
    </React.Fragment>
  );
};

export default Footballers;
