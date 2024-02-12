import React, { useEffect, useState, useContext } from "react";
import { useHistory, NavLink, Link } from "react-router-dom";
import {
  Space,
  Table,
  Image,
  Dropdown,
  Button,
  Modal,
  Flex,
  Pagination,
} from "antd";
import moment from "moment";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
import NewFootballer from "./NewFootballer";
import UpdateFootballer from "./UpdateFootballer";

const Footballers = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedFotballers, setLoadedFootballers] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedFootballerId, setDeletedFootballerId] = useState(null);
  const [editFootballerId, setEditFootballerId] = useState(null);
  const [isModalForAdd, setIsModalForAdd] = useState(false);
  const [isModalForEdit, setIsModalForEdit] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
  });

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
      history.push("/admins/footballers");
    } catch (err) {}
  };

  const updateFootballers = async () => {
    setIsModalForAdd(false);
    try {
      const responseData = await sendRequest(
        "http://localhost:5001/api/admins/footballers"
      );
      setLoadedFootballers(responseData.footballers);
    } catch (err) {
      console.error(err);
    }
  };

  const showModalForDelete = (id) => {
    setIsModalOpen(true);
    setDeletedFootballerId(id);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const hideFormForAdd = () => {
    setIsModalForAdd(false);
  };

  const hideFormForEdit = () => {
    setIsModalForEdit(false);
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
            <Button
              onClick={() => {
                history.push(`/admins/footballers/${footballer.key}`);
                setIsModalForEdit(true);
                setEditFootballerId(footballer.key);
              }}
            >
              Edit
            </Button>
            <Button danger onClick={() => showModalForDelete(footballer.key)}>
              Delete
            </Button>
          </Flex>
        </Space>
      ),
    },
  ];

  // const onChange = (pagination, filters, sorter, extra) => {
  //   console.log("params", pagination, filters, sorter, extra);
  // };

  const onChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
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
        <Button
          type="primary"
          style={{
            fontSize: "16px",
          }}
          onClick={() => {
            history.push("/admins/footballers/new");
            setIsModalForAdd(true);
          }}
        >
          Add Footballer
        </Button>
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
      <Modal
        title="Add new footballer"
        open={isModalForAdd}
        onCancel={hideFormForAdd}
        footer={null}
      >
        <NewFootballer updateFootballers={updateFootballers} />
      </Modal>
      <Modal
        title="Edit footballer"
        open={isModalForEdit}
        onCancel={hideFormForEdit}
        footer={null}
      >
        <UpdateFootballer
          footballerId={editFootballerId}
          hideForm={hideFormForEdit}
          updateFootballers={updateFootballers}
        />
      </Modal>
      {!isLoading && loadedFotballers && (
        <>
          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            onChange={onChange}
          />
          <div className="pagination">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={data.length}
              onChange={onChange}
            />
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export default Footballers;
