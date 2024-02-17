import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Space, Table, Image, Flex, Button, Modal, message } from "antd";
import moment from "moment";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const Transfers = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedTransfers, setLoadedTransfers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedTransferId, setDeletedTransferId] = useState(null);

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/admins/transfers"
        );
        setLoadedTransfers(responseData.transfers);
        console.log(responseData.transfers.length);
        console.log(responseData.transfers);
      } catch (err) {}
    };
    fetchTransfers();
  }, [sendRequest]);

  const confirmDeleteHandler = async () => {
    setIsModalOpen(false);
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/transfers/${deletedTransferId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setDeletedTransferId(null);
      setLoadedTransfers((prevTransfers) =>
        prevTransfers.filter((transfer) => transfer.id !== deletedTransferId)
      );
      message.success("Transfer successfully deleted!");
    } catch (err) {}
  };

  const showModalForDelete = (id) => {
    setIsModalOpen(true);
    setDeletedTransferId(id);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
      title: "Season",
      dataIndex: "season",
      key: "season",
    },
    {
      title: "Compensation Amount",
      dataIndex: "compensationAmount",
      key: "compensationAmount",
    },
    {
      key: "action",
      render: (transfer) => (
        <Space size="middle">
          <Flex gap="small">
            <Link to={`/admins/transfers/${transfer.key}`}>
              <Button>Edit</Button>
            </Link>
            <Button danger onClick={() => showModalForDelete(transfer.key)}>
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

  const data = loadedTransfers
    ? loadedTransfers.map((transfer) => ({
        key: transfer.id,
        image: transfer.footballer ? transfer.footballer.image : "Not found",
        name: transfer.footballer ? transfer.footballer.name : "Not found",
        surname: transfer.footballer
          ? transfer.footballer.surname
          : "Not found",
        fromClub: transfer.fromClub
          ? transfer.fromClub.name
          : "Not found",
        toClub: transfer.toClub ? transfer.toClub.name : "Not found",
        transferFee: transfer.transferFee,
        transferDate: transfer.transferDate,
        transferType: transfer.transferType,
        season: transfer.season,
        compensationAmount: transfer.compensationAmount,
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
        <Link to="/admins/transfers/new">
          <Button
            type="primary"
            style={{
              fontSize: "16px",
            }}
          >
            Add transfer
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
        Do you want to proceed and delete this transfer? Please note that it
        can't be undone thereafter.
      </Modal>
      {!isLoading && (
        <Table columns={columns} dataSource={data} onChange={onChange} />
      )}
    </React.Fragment>
  );
};

export default Transfers;
