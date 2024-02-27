import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Table, Space, Flex, Image, Button, Modal, message } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const Clubs = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedClubs, setLoadedClubs] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedClubId, setDeletedClubId] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/admins/clubs"
        );

        setLoadedClubs(responseData.clubs);
      } catch (err) {}
    };
    fetchClubs();
  }, [sendRequest]);

  const confirmDeleteHandler = async () => {
    setIsModalOpen(false);
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/clubs/${deletedClubId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setDeletedClubId(null);
      setLoadedClubs((prevClubs) =>
        prevClubs.filter((club) => club.id !== deletedClubId)
      );
      message.success("Club successfully deleted!");
    } catch (err) {}
  };

  const showModalForDelete = (id) => {
    setIsModalOpen(true);
    setDeletedClubId(id);
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
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (cost) => {
        const formattedCost = cost
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return `${formattedCost} €`;
      },
    },
    {
      title: "Foundation year",
      dataIndex: "foundationYear",
      key: "foundationYear",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      key: "action",
      render: (club) => (
        <Space size="middle">
          <Flex gap="small">
            <Link to={`/admins/clubs/${club.key}`}>
              <Button>
                <EditTwoTone />
              </Button>
            </Link>
            <Button danger onClick={() => showModalForDelete(club.key)}>
              <DeleteTwoTone twoToneColor="#eb2f96" />
            </Button>
          </Flex>
        </Space>
      ),
    },
  ];

  const data = loadedClubs
    ? loadedClubs.map((club) => ({
        id: club.id,
        image: club.image,
        name: club.name,
        country: club.country,
        cost: club.cost,
        foundationYear: club.foundationYear,
        description: club.description,
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
          <Link to="/admins/clubs/new">
            <Button type="primary">Add Club</Button>
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
        Do you want to proceed and delete this club? Please note that it can't
        be undone thereafter.
      </Modal>
      {!isLoading && loadedClubs && (
        <Table
          columns={columns}
          dataSource={data.map((club, index) => ({
            ...club,
            key: club.id,
            number: limit * (page - 1) + index + 1,
          }))}
          pagination={{
            pageSize: limit,
            total: data.length,
            showSizeChanger: true,
            pageSizeOptions: [1, 2, 4, 10, 20],
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

export default Clubs;
