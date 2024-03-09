import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Space,
  Flex,
  Button,
  Modal,
  Image,
  Input,
  Select,
  Tooltip,
  Divider,
  Pagination,
  Typography,
  Spin,
  message,
} from "antd";
import {
  EditTwoTone,
  DeleteTwoTone,
  FilterOutlined,
  FilterFilled,
} from "@ant-design/icons";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const Agents = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedAgents, setLoadedAgents] = useState();
  const [countriesList, setCountriesList] = useState();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [country, setCountry] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedAgentId, setDeletedAgentId] = useState(null);

  const [isFilterFormVisible, setIsFilterFormVisible] = useState(false);
  const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/agents?search=${searchTerm}&sortBy=${sortCriteria}&sortDir=${sortDirection}&country=${country}&page=${currentPage}&pageSize=${pageSize}`
        );

        setLoadedAgents(responseData.agents);
        setTotalItems(responseData.totalItems);
      } catch (err) {}
    };
    fetchAgents();
  }, [
    searchTerm,
    sortCriteria,
    sortDirection,
    country,
    currentPage,
    pageSize,
    sendRequest,
  ]);

  const confirmDeleteHandler = async () => {
    setIsModalOpen(false);
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/agents/${deletedAgentId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setDeletedAgentId(null);
      setLoadedAgents((prevAgents) =>
        prevAgents.filter((agent) => agent._id !== deletedAgentId)
      );
      message.success("Agent successfully deleted!");
    } catch (err) {}
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/admins/agents/"
        );
        const countries = response.agents.map((agent) => agent.country);
        const uniqueCountries = [...new Set(countries)];
        setCountriesList(uniqueCountries);
      } catch (err) {}
    };
    fetchCountries();
  }, [sendRequest]);

  const showModalForDelete = (id) => {
    setIsModalOpen(true);
    setDeletedAgentId(id);
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

  const handleCountryChange = (value) => {
    setCountry(value);
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
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => {
        return <Typography.Paragraph copyable>{email}</Typography.Paragraph>;
      },
    },
    {
      title: "Phone number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (number) => {
        return `+380-${number}`;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      key: "action",
      render: (agent) => (
        <Space size="middle">
          <Flex gap="small">
            <Link to={`/admins/agents/${agent.key}`}>
              <Button>
                <EditTwoTone />
              </Button>
            </Link>
            <Button danger onClick={() => showModalForDelete(agent.key)}>
              <DeleteTwoTone twoToneColor="#eb2f96" />
            </Button>
          </Flex>
        </Space>
      ),
    },
  ];

  const data = loadedAgents
    ? loadedAgents.map((agent) => ({
        key: agent.id,
        image: agent.image,
        name: agent.name,
        surname: agent.surname,
        country: agent.country,
        email: agent.email,
        phoneNumber: agent.phoneNumber,
        description: agent.description,
      }))
    : [];

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading ? (
        <div className="center">
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <Link to="/admins/agents/new">
            <Button type="primary">Add Agent</Button>
          </Link>
        </div>
      )}
      <br />
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Tooltip title="Search for a agent" placement="top">
          <Input.Search
            placeholder="Search agents..."
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
              style={{ width: 140, marginBottom: "1rem", marginRight: "1rem" }}
            >
              <Select.Option value="name">Name</Select.Option>
              <Select.Option value="surname">Surname</Select.Option>
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
          <Divider>| Country |</Divider>
          <Tooltip title="Select the agent's country" placement="top">
            <Select
              placeholder="Select country"
              onChange={handleCountryChange}
              value={country}
              style={{ width: 200 }}
            >
              <Select.Option value="">All Countries</Select.Option>
              {countriesList &&
                countriesList.map((country) => (
                  <Select.Option key={country} value={country}>
                    {country}
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
        Do you want to proceed and delete this agent? Please note that it can't
        be undone thereafter.
      </Modal>
      {!isLoading && loadedAgents && (
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

export default Agents;
