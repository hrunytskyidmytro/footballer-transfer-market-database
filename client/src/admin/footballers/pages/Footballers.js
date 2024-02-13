import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Space, Table, Image, Button, Modal, Flex, message } from "antd";
import moment from "moment";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const Footballers = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedFotballers, setLoadedFootballers] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedFootballerId, setDeletedFootballerId] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchFootballers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/admins/footballers"
        );

        setLoadedFootballers(responseData.footballers);
      } catch (err) {}
    };
    fetchFootballers();
  }, [sendRequest]);

  const confirmDeleteHandler = async () => {
    setIsModalOpen(false);
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/footballers/${deletedFootballerId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setDeletedFootballerId(null);
      setLoadedFootballers((prevFootballers) =>
        prevFootballers.filter(
          (footballer) => footballer._id !== deletedFootballerId
        )
      );
      message.success("Footballer successfully deleted!");
    } catch (err) {}
  };

  const showModalForDelete = (id) => {
    setIsModalOpen(true);
    setDeletedFootballerId(id);
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
      filters: [
        {
          text: "Jack",
          value: "Jack",
        },
        {
          text: "John",
          value: "John",
        },
      ],
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
    },
    {
      title: "Date of Birth",
      dataIndex: "birthDate",
      key: "birthDate",
      render: (text) => moment(text).format("MMMM Do YYYY"),
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Clubs",
      dataIndex: "clubs",
      key: "clubs",
    },
    {
      title: "Transfers",
      dataIndex: "transfers",
      key: "transfers",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.transfers - b.transfers,
    },
    {
      key: "action",
      render: (footballer) => (
        <Space size="middle">
          <Flex gap="small">
            <Link to={`/admins/footballers/${footballer.key}`}>
              <Button>Edit</Button>
            </Link>
            <Button danger onClick={() => showModalForDelete(footballer.key)}>
              Delete
            </Button>
          </Flex>
        </Space>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const data = loadedFotballers
    ? loadedFotballers.map((footballer) => ({
        key: footballer.id,
        image: footballer.image,
        name: footballer.name,
        surname: footballer.surname,
        nationality: footballer.nationality,
        birthDate: footballer.birthDate,
        position: footballer.position,
        clubs: footballer.clubs.length,
        transfers: footballer.transfers.length,
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
        <Link to="/admins/footballers/new">
          <Button
            type="primary"
            style={{
              fontSize: "16px",
            }}
          >
            Add Footballer
          </Button>
        </Link>
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
        Do you want to proceed and delete this footballer? Please note that it
        can't be undone thereafter.
      </Modal>
      {!isLoading && loadedFotballers && (
        <>
          <Table
            columns={columns}
            dataSource={data.map((footballer, index) => ({
              ...footballer,
              key: footballer.id,
              number: limit * (page - 1) + index + 1
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
            onChange={onChange}
          />
        </>
      )}
    </React.Fragment>
  );
};

export default Footballers;
