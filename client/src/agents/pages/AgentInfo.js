import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Modal } from "antd";

import AgentCard from "../components/AgentCard";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const AgentInfo = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedAgent, setLoadedAgent] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <Spin size="large" />
        </div>
      )}
      {loadedAgent && (
        <>
          <AgentCard agent={loadedAgent} showModal={showModal} />
          <Modal
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={700}
          >
            {loadedAgent && (
              <img
                src={`http://localhost:5001/${loadedAgent.image}`}
                alt={`${loadedAgent.name} ${loadedAgent.surname}`}
                style={{ width: "100%" }}
              />
            )}
          </Modal>
        </>
      )}
    </>
  );
};

export default AgentInfo;
