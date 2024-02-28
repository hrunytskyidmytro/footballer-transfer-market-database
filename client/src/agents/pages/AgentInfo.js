import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const AgentInfo = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedAgent, setLoadedAgent] = useState();
  const { agentId } = useParams();

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/agents/${agentId}`
        );

        setLoadedAgent(responseData.agent);
      } catch (err) {}
    };
    fetchAgent();
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
        {loadedAgent && (
          <article>
            <p>
              <img
                alt={`${loadedAgent.name} ${loadedAgent.surname}`}
                src={`http://localhost:5001/${loadedAgent.image}`}
              />
            </p>
            <h2>{`${loadedAgent.name} ${loadedAgent.surname}`}</h2>
            <p>Email: {loadedAgent.email}</p>
            <p>Phone number: +380-{loadedAgent.phoneNumber}</p>
            <p>Description: {loadedAgent.description} </p>
          </article>
        )}
      </div>
    </React.Fragment>
  );
};

export default AgentInfo;
