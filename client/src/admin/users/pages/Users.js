import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Table, Space, Flex, Button, Modal, message } from "antd";
import { UserOutlined, EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import moment from "moment";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const Users = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedUserId, setDeletedUserId] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/admins/users"
        );

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  const confirmDeleteHandler = async () => {
    setIsModalOpen(false);
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/users/${deletedUserId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setDeletedUserId(null);
      setLoadedUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== deletedUserId)
      );
      message.success("User successfully deleted!");
    } catch (err) {}
  };

  const showModalForDelete = (id) => {
    setIsModalOpen(true);
    setDeletedUserId(id);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "",
      dataIndex: "avatar",
      key: "avatar",
      render: () => <UserOutlined />,
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Date of registration",
      dataIndex: "registrationDate",
      key: "registrationDate",
      render: (text) => moment(text).format("MMMM Do YYYY"),
    },
    {
      key: "action",
      render: (user) => (
        <Space size="middle">
          <Flex gap="small">
            <Link to={`/admins/users/${user.key}`}>
              <Button>
                <EditTwoTone />
              </Button>
            </Link>
            <Button danger onClick={() => showModalForDelete(user.key)}>
              <DeleteTwoTone twoToneColor="#eb2f96" />
            </Button>
          </Flex>
        </Space>
      ),
    },
  ];

  const data = loadedUsers
    ? loadedUsers.map((user) => ({
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        registrationDate: user.registrationDate,
        role: user.role,
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
      <Modal
        title="Are you sure?"
        open={isModalOpen}
        onOk={confirmDeleteHandler}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        Do you want to proceed and delete this user? Please note that it can't
        be undone thereafter.
      </Modal>
      {!isLoading && loadedUsers && (
        <Table
          columns={columns}
          dataSource={data.map((user, index) => ({
            ...user,
            key: user.id,
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

export default Users;
