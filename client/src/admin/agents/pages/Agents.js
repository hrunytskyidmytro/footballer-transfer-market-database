import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Table, Space, Flex, Button, Modal, Image, message } from "antd";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const Agents = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedAgents, setLoadedAgents] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedAgentId, setDeletedAgentId] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/admins/agents"
        );

        setLoadedAgents(responseData.agents);
      } catch (err) {}
    };
    fetchAgents();
  }, [sendRequest]);

  const confirmDeleteHandler = async () => {
    setIsModalOpen(false);
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/agents/${deletedAgentId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setDeletedAgentId(null);
      setLoadedAgents((prevAgents) =>
        prevAgents.filter((agent) => agent._id !== deletedAgentId)
      );
      message.success("Agent successfully deleted!");
    } catch (err) {}
  };

  const showModalForDelete = (id) => {
    setIsModalOpen(true);
    setDeletedAgentId(id);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image width={100} src={`http://localhost:5001/${image}`} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      key: "action",
      render: (agent) => (
        <Space size="middle">
          <Flex gap="small">
            <Link to={`/admins/agents/${agent.key}`}>
              <Button>Edit</Button>
            </Link>
            <Button danger onClick={() => showModalForDelete(agent.key)}>
              Delete
            </Button>
          </Flex>
        </Space>
      ),
    },
  ];

  const data = loadedAgents
    ? loadedAgents.map((agent) => ({
        id: agent.id,
        image: agent.image,
        name: agent.name,
        surname: agent.surname,
        country: agent.country,
        email: agent.email,
        phoneNumber: agent.phoneNumber,
        description: agent.description,
      }))
    : [];

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading ? (
        <div className="center">
          <LoadingSpinner />
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <Link to="/admins/agents/new">
            <Button
              type="primary"
              style={{
                fontSize: "16px",
              }}
            >
              Add Agent
            </Button>
          </Link>
        </div>
      )}
      <div
        style={{
          height: 20,
        }}
      ></div>
      <Modal
        title="Are you sure?"
        open={isModalOpen}
        onOk={confirmDeleteHandler}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        Do you want to proceed and delete this agent? Please note that it can't
        be undone thereafter.
      </Modal>
      {!isLoading && loadedAgents && (
        <Table
          columns={columns}
          dataSource={data.map((news, index) => ({
            ...news,
            key: news.id,
            number: limit * (page - 1) + index + 1,
          }))}
          pagination={{
            pageSize: limit,
            total: data.length,
            showSizeChanger: true,
            pageSizeOptions: [2, 4, 10, 20],
            responsive: true,
            showTotal: (total) => `All ${total}`,
            onChange: (page, pageSize) => {
              setPage(page);
              setLimit(pageSize);
            },
          }}
        />
      )}
    </React.Fragment>
  );
};

export default Agents;
