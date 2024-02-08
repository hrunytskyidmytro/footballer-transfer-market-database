import React, { useEffect, useState } from "react";
import { useHistory, NavLink, Link } from "react-router-dom";
import { Space, Table, Image, Dropdown, Button, Modal } from "antd";
import moment from "moment";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import NewFootballer from "./NewFootballer";

const Footballers = () => {
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedFotballers, setLoadedFootballers] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const items = [
    {
      key: "1",
      label: "Edit",
    },
    {
      key: "2",
      label: "Delete",
    },
  ];

  const onMenuClick = (e) => {
    console.log("click", e);
  };

  const showModal = () => {
    setIsModalOpen(true);
    // history.push("/footballers/new");
  };

  const handleOk = () => {
    setIsModalOpen(false);
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
      render: (_) => (
        <Space size="middle">
          <Dropdown.Button
            menu={{
              items,
              onClick: onMenuClick,
            }}
          >
            Actions
          </Dropdown.Button>
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
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {/* <Button
        type="primary"
        onClick={showModal}
        style={{
          fontSize: "16px",
        }}
      >
        Add Footballer
      </Button> */}
      <NavLink to="./footballers/new">Add Footballer</NavLink>
      <div
        style={{
          height: 20,
        }}
      ></div>
      <Modal
        title="Add new footballer"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <NewFootballer />
      </Modal>
      {!isLoading && loadedFotballers && (
        <>
          <Table columns={columns} dataSource={data} onChange={onChange} />
        </>
      )}
    </React.Fragment>
  );
};

export default Footballers;
