import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Spin } from "antd";
// import moment from "moment";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Agents = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedAgents, setLoadedAgents] = useState();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/agents/"
        );

        setLoadedAgents(responseData.agents);
      } catch (err) {}
    };
    fetchAgents();
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
          loadedAgents &&
          loadedAgents.map((agent) => (
            <Link to={`/agents/${agent.id}`} key={agent.id}>
              <Card
                key={agent.id}
                hoverable
                style={{ width: 200, margin: 20 }}
                cover={
                  <img
                    alt={`${agent.name} ${agent.surname}`}
                    src={`http://localhost:5001/${agent.image}`}
                  />
                }
              >
                <Card.Meta
                  title={`${agent.name} ${agent.surname}`}
                  description={`Country: ${agent.country}`}
                />
              </Card>
            </Link>
          ))}
      </div>
    </React.Fragment>
  );
};

export default Agents;
