import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Space,
  Flex,
  Button,
  Input,
  Select,
  Tooltip,
  Divider,
  Pagination,
  Modal,
  Tag,
  Spin,
  message,
} from "antd";
import {
  UserOutlined,
  EditTwoTone,
  DeleteTwoTone,
  FilterOutlined,
  FilterFilled,
} from "@ant-design/icons";
import moment from "moment";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const Users = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const [rolesList, setRolesList] = useState();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [role, setRole] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedUserId, setDeletedUserId] = useState(null);

  const [isFilterFormVisible, setIsFilterFormVisible] = useState(false);
  const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/users?search=${searchTerm}&sortBy=${sortCriteria}&sortDir=${sortDirection}&role=${role}&page=${currentPage}&pageSize=${pageSize}`
        );

        setLoadedUsers(responseData.users);
        setTotalItems(responseData.totalItems);
      } catch (err) {}
    };
    fetchUsers();
  }, [
    searchTerm,
    sortCriteria,
    sortDirection,
    role,
    currentPage,
    pageSize,
    sendRequest,
  ]);

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

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/admins/users/"
        );
        const roles = response.users.map((user) => user.role);
        const uniqueRoles = [...new Set(roles)];
        setRolesList(uniqueRoles);
      } catch (err) {}
    };
    fetchRoles();
  }, [sendRequest]);

  const showModalForDelete = (id) => {
    setIsModalOpen(true);
    setDeletedUserId(id);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (event) => {
    const inputValue = event.target.value;
    const invalidCharactersRegex = /[{}[\]()&^%$#@!*]/;
    const hasNumbers = /\d/.test(inputValue);

    if (invalidCharactersRegex.test(inputValue) || hasNumbers) {
      if (!isErrorDisplayed) {
        message.error("Error: Invalid characters entered!");
        setIsErrorDisplayed(true);
      }
    } else {
      setSearchTerm(inputValue);
      setIsErrorDisplayed(false);
    }
  };

  const handleSortCriteriaChange = (value) => {
    setSortCriteria(value);
  };

  const handleSortDirectionChange = (value) => {
    setSortDirection(value);
  };

  const handleRoleChange = (value) => {
    setRole(value);
  };

  const toggleFilterFormVisibility = () => {
    setIsFilterFormVisible(!isFilterFormVisible);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(current);
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
      render: (role) => {
        let tagColor = "";
        switch (role) {
          case "user":
            tagColor = "blue";
            break;
          case "admin":
            tagColor = "green";
            break;
          case "football_manager":
            tagColor = "orange";
            break;
          default:
            tagColor = "blue";
        }
        return <Tag color={tagColor}>{role}</Tag>;
      },
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
        key: user.id,
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
          <Spin size="large" />
        </div>
      )}
      <br />
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Tooltip title="Search for a user" placement="top">
          <Input.Search
            placeholder="Search users..."
            onChange={handleSearch}
            enterButton
            style={{ width: 400 }}
          />
        </Tooltip>
        <div>
          <Tooltip title="Select sorting criteria" placement="top">
            <Select
              defaultValue="name"
              onChange={handleSortCriteriaChange}
              style={{ width: 160, marginBottom: "1rem", marginRight: "1rem" }}
            >
              <Select.Option value="name">Name</Select.Option>
              <Select.Option value="surname">Surname</Select.Option>
              <Select.Option value="registrationDate">
                Date of registration
              </Select.Option>
            </Select>
          </Tooltip>
          <Tooltip title="Select sorting direction" placement="top">
            <Select
              defaultValue="asc"
              onChange={handleSortDirectionChange}
              style={{ width: 120, marginBottom: "1rem" }}
            >
              <Select.Option value="asc">Asc</Select.Option>
              <Select.Option value="desc">Desc</Select.Option>
            </Select>
          </Tooltip>
        </div>
        <Tooltip title="Set the filters" placement="top">
          <Button onClick={toggleFilterFormVisibility}>
            {isFilterFormVisible ? (
              <>
                <FilterOutlined /> Hide filters
              </>
            ) : (
              <>
                <FilterFilled /> Show filters
              </>
            )}
          </Button>
        </Tooltip>
      </div>
      <br />
      {isFilterFormVisible && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 10,
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <Divider>| Role |</Divider>
          <Tooltip title="Select the user's role" placement="top">
            <Select
              placeholder="Select role"
              onChange={handleRoleChange}
              value={role}
              style={{ width: 200 }}
            >
              <Select.Option value="">All Roles</Select.Option>
              {rolesList &&
                rolesList.map((role) => (
                  <Select.Option key={role} value={role}>
                    {role}
                  </Select.Option>
                ))}
            </Select>
          </Tooltip>
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
        <Table columns={columns} dataSource={data} pagination={false} />
      )}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger={true}
          pageSizeOptions={[2, 4, 10, 20]}
          responsive={true}
          showTotal={(total) => `All ${total}`}
          onShowSizeChange={handlePageSizeChange}
        />
      </div>
    </React.Fragment>
  );
};

export default Users;
