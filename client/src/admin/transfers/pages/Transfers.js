import React, { useEffect, useState } from "react";
import { Space, Table, Image, Dropdown } from "antd";
import moment from "moment";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";

const Transfers = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedTransfers, setLoadedTransfers] = useState([]);
  const [transferData, setTransferData] = useState([]);

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/admins/transfers"
        );
        setLoadedTransfers(responseData.transfers);
      } catch (err) {}
    };
    fetchTransfers();
  }, [sendRequest]);

  useEffect(() => {
    const fetchDataForTransfers = async () => {
      const data = [];
      for (const transfer of loadedTransfers) {
        try {
          const footballerResponse = await sendRequest(
            `http://localhost:5001/api/admins/footballers/${transfer.footballer}`
          );
          const fromClubResponse = await sendRequest(
            `http://localhost:5001/api/admins/clubs/${transfer.fromClub}`
          );
          const toClubResponse = await sendRequest(
            `http://localhost:5001/api/admins/clubs/${transfer.toClub}`
          );
          data.push({
            key: transfer.id,
            image: footballerResponse
              ? footballerResponse.footballer.image
              : "Not found",
            name: footballerResponse
              ? footballerResponse.footballer.name
              : "Not found",
            surname: footballerResponse
              ? footballerResponse.footballer.surname
              : "Not found",
            fromClub: fromClubResponse
              ? fromClubResponse.club.name
              : "Not found",
            toClub: toClubResponse ? toClubResponse.club.name : "Not found",
            transferFee: transfer.transferFee,
            transferDate: transfer.transferDate,
            transferType: transfer.transferType,
          });
        } catch (err) {}
      }
      setTransferData(data);
    };

    if (loadedTransfers.length > 0) {
      fetchDataForTransfers();
    }
  }, [loadedTransfers, sendRequest]);

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

  const columns = [
    {
      title: "Footballer image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image width={100} src={`http://localhost:5001/${image}`} />
      ),
    },
    {
      title: "Footballer name",
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
      title: "Footballer surname",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "From club",
      dataIndex: "fromClub",
      key: "fromClub",
    },
    {
      title: "To club",
      dataIndex: "toClub",
      key: "toClub",
    },
    {
      title: "Transfer fee",
      dataIndex: "transferFee",
      key: "transferFee",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.transferFee - b.transferFee,
    },
    {
      title: "Transfer Date",
      dataIndex: "transferDate",
      key: "transferDate",
      render: (text) => moment(text).format("MMMM Do YYYY"),
    },
    {
      title: "Transfer Type",
      dataIndex: "transferType",
      key: "transferType",
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

  return (
    <React.Fragment>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <Table
          columns={columns}
          dataSource={transferData}
          onChange={onChange}
        />
      )}
    </React.Fragment>
  );
};

export default Transfers;
