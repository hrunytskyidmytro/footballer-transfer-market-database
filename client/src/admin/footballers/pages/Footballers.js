import React, { useEffect, useState } from "react";
import { Space, Table } from 'antd';
import moment from "moment";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";

const Footballers = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedFotballers, setLoadedFootballers] = useState();

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

  const columns = [
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
    },
    {
      title: "Action",
      key: "action",
      render: (_) => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const data = loadedFotballers
    ? loadedFotballers.map((footballer) => ({
        key: footballer.id,
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
      {!isLoading && loadedFotballers && loadedFotballers.length > 0 && (
        <Table columns={columns} dataSource={data} pagination={true} />
      )}
    </React.Fragment>
  );
};

export default Footballers;
