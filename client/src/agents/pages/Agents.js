import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Typography,
  Row,
  Avatar,
  Input,
  Select,
  Tooltip,
  message,
  Pagination,
  Divider,
  Spin,
} from "antd";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Agents = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedAgents, setLoadedAgents] = useState();
  const [countriesList, setCountriesList] = useState();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [country, setCountry] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/agents/?search=${searchTerm}&sortBy=${sortCriteria}&sortDir=${sortDirection}&country=${country}&page=${currentPage}&pageSize=${pageSize}`
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

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await sendRequest("http://localhost:5001/api/agents/");
        const countries = response.agents.map((agent) => agent.country);
        const uniqueCountries = [...new Set(countries)];
        setCountriesList(uniqueCountries);
      } catch (err) {}
    };
    fetchCountries();
  }, [sendRequest]);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(current);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <Spin size="large" />
        </div>
      )}
      <br />
      <Tooltip title="Search for a agent" placement="top">
        <Input.Search
          placeholder="Search agents..."
          onChange={handleSearch}
          enterButton
          style={{ width: 400 }}
        />
      </Tooltip>
      <br />
      <br />
      <Tooltip title="Select sorting criteria" placement="topRight">
        <Select
          defaultValue="name"
          onChange={handleSortCriteriaChange}
          style={{ width: 120, marginBottom: "1rem", marginRight: "1rem" }}
        >
          <Select.Option value="name">Name</Select.Option>
          <Select.Option value="surname">Surname</Select.Option>
        </Select>
      </Tooltip>
      <Tooltip title="Select sorting direction" placement="topLeft">
        <Select
          defaultValue="asc"
          onChange={handleSortDirectionChange}
          style={{ width: 120, marginBottom: "1rem" }}
        >
          <Select.Option value="asc">Asc</Select.Option>
          <Select.Option value="desc">Desc</Select.Option>
        </Select>
      </Tooltip>
      <br />
      <br />
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
      <br />
      <br />
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Row gutter={[16, 16]}>
          {!isLoading &&
            loadedAgents &&
            loadedAgents.map((agent) => (
              <div
                key={agent.id}
                style={{
                  width: "300px",
                  margin: "16px",
                }}
              >
                <Link to={`/agents/${agent.id}`}>
                  <Card
                    hoverable
                    style={{ width: "100%", minHeight: "200px" }}
                    cover={
                      <div style={{ textAlign: "center" }}>
                        <Avatar
                          size={64}
                          src={`http://localhost:5001/${agent.image}`}
                          alt={`${agent.name} ${agent.surname}`}
                          style={{ margin: 10 }}
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={`${agent.name} ${agent.surname}`}
                      description={
                        <Typography.Text copyable>
                          {agent.email}
                        </Typography.Text>
                      }
                    />
                  </Card>
                </Link>
              </div>
            ))}
        </Row>
      </div>
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
      {/* <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        dataSource={loadedAgents}
        renderItem={(agent) => (
          <List.Item>
            <Link to={`/agents/${agent.id}`}>
              <Card
                hoverable
                style={{ width: "100%", minHeight: "200px" }}
                cover={
                  <div style={{ textAlign: "center" }}>
                    <Avatar
                      size={64}
                      src={`http://localhost:5001/${agent.image}`}
                      alt={`${agent.name} ${agent.surname}`}
                      style={{ margin: 10 }}
                    />
                  </div>
                }
              >
                <Card.Meta
                  title={`${agent.name} ${agent.surname}`}
                  description={
                    <Typography.Text copyable>{agent.email}</Typography.Text>
                  }
                />
              </Card>
            </Link>
          </List.Item>
        )}
      /> */}
    </React.Fragment>
  );
};

export default Agents;
