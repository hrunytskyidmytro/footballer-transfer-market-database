import React, { useEffect, useState } from "react";
import { Table, Space, Dropdown } from "antd";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

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
      title: "User",
      dataIndex: "name",
      key: "name",
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
      title: "Footballer Count",
      dataIndex: "footballerCount",
      key: "footballerCount",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.footballerCount - b.footballerCount,
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

  const data = loadedUsers
    ? loadedUsers.map((user) => ({
        key: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        footballerCount: user.footballers.length,
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
      {!isLoading && loadedUsers && (
        <Table columns={columns} dataSource={data} pagination={true} />
      )}
    </React.Fragment>
  );
};

export default Users;