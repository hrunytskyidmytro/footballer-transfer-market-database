import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Space,
  Flex,
  Image,
  Input,
  Select,
  Tooltip,
  Button,
  Modal,
  Divider,
  Slider,
  Pagination,
  Spin,
  message,
} from "antd";
import {
  EuroCircleOutlined,
  EditTwoTone,
  DeleteTwoTone,
  FilterOutlined,
  FilterFilled,
} from "@ant-design/icons";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const Clubs = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedClubs, setLoadedClubs] = useState();
  const [countriesList, setCountriesList] = useState();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [country, setCountry] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [costFrom, setCostFrom] = useState("");
  const [costTo, setCostTo] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedClubId, setDeletedClubId] = useState(null);

  const [isFiltering, setIsFiltering] = useState(false);
  const [isFilterFormVisible, setIsFilterFormVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);
  const [yearError, setYearError] = useState("");
  const [costError, setCostError] = useState("");

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/clubs?search=${searchTerm}&sortBy=${sortCriteria}&sortDir=${sortDirection}&country=${country}&yearFrom=${yearFrom}&yearTo=${yearTo}&costFrom=${costFrom}&costTo=${costTo}&page=${currentPage}&pageSize=${pageSize}`
        );

        setLoadedClubs(responseData.clubs);
        setTotalItems(responseData.totalItems);
      } catch (err) {}
    };
    fetchClubs();
  }, [
    searchTerm,
    sortCriteria,
    sortDirection,
    country,
    yearFrom,
    yearTo,
    costFrom,
    costTo,
    currentPage,
    pageSize,
    sendRequest,
  ]);

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

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/admins/clubs/"
        );
        const countries = response.clubs.map((club) => club.country);
        const uniqueCountries = [...new Set(countries)];
        setCountriesList(uniqueCountries);
      } catch (err) {}
    };
    fetchCountries();
  }, [sendRequest]);

  const showModalForDelete = (id) => {
    setIsModalOpen(true);
    setDeletedClubId(id);
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
    setIsFiltering(true);
  };

  const handleYearFromChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > new Date().getFullYear()) {
      setYearError(
        `Year must be between 1800 and ${new Date().getFullYear()}.`
      );
    } else {
      setYearError("");
      setYearFrom(value);
      setIsFiltering(true);
    }
  };

  const handleYearToChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > new Date().getFullYear()) {
      setYearError(
        `Year must be between 1800 and ${new Date().getFullYear()}.`
      );
    } else {
      setYearError("");
      setYearTo(value);
      setIsFiltering(true);
    }
  };

  const handleCostFromChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > 1000000000) {
      setCostError("Cost must be between 0 and 1000000000.");
    } else {
      setCostError("");
      setCostFrom(value);
      setIsFiltering(true);
    }
  };

  const handleCostToChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > 1000000000) {
      setCostError("Cost must be between 0 and 1000000000.");
    } else {
      setCostError("");
      setCostTo(value);
      setIsFiltering(true);
    }
  };

  const handleCostSliderChange = (value) => {
    setCostFrom(value[0]);
    setCostTo(value[1]);
    setIsFiltering(true);
  };

  const handleClearFilters = () => {
    setCountry("");
    setYearFrom("");
    setYearTo("");
    setCostFrom("");
    setCostTo("");
    setIsFiltering(false);
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
        key: club.id,
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
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <Link to="/admins/clubs/new">
            <Button type="primary">Add Club</Button>
          </Link>
        </div>
      )}
      <br />
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Tooltip title="Search for a club" placement="top">
          <Input.Search
            placeholder="Search clubs..."
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
              <Select.Option value="cost">Cost</Select.Option>
              <Select.Option value="foundationYear">
                Foundation year
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
          <Divider>| Country |</Divider>
          <Tooltip title="Select the club's country" placement="top">
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
          <Divider>| Year |</Divider>
          {yearError && <p style={{ color: "red" }}>{yearError}</p>}
          <Tooltip title="Enter the minimum year" placement="top">
            <Input
              type="number"
              placeholder="Year from"
              value={yearFrom}
              min={1800}
              max={new Date().getFullYear()}
              onChange={handleYearFromChange}
              style={{ width: 220, marginBottom: "1rem", marginRight: "1rem" }}
              addonAfter={"Y"}
            />
          </Tooltip>
          <Tooltip title="Enter the maximum year" placement="top">
            <Input
              type="number"
              placeholder="Year to"
              value={yearTo}
              min={1800}
              max={new Date().getFullYear()}
              onChange={handleYearToChange}
              style={{ width: 220, marginBottom: "1rem" }}
              addonAfter={"Y"}
            />
          </Tooltip>
          <br />
          <Divider>| Cost |</Divider>
          {costError && <p style={{ color: "red" }}>{costError}</p>}
          <Tooltip title="Enter the minimum cost" placement="top">
            <Input
              type="number"
              placeholder="Cost from"
              value={costFrom}
              min={0}
              max={1000000000}
              onChange={handleCostFromChange}
              style={{ width: 220, marginBottom: "1rem", marginRight: "1rem" }}
              addonAfter={<EuroCircleOutlined />}
            />
          </Tooltip>
          <Tooltip title="Enter the maximum cost" placement="top">
            <Input
              type="number"
              placeholder="Cost to"
              value={costTo}
              min={0}
              max={1000000000}
              onChange={handleCostToChange}
              style={{ width: 220, marginBottom: "1rem" }}
              addonAfter={<EuroCircleOutlined />}
            />
          </Tooltip>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Slider
              range
              min={0}
              max={1000000000}
              step={1}
              value={[costFrom, costTo]}
              defaultValue={[0, 100]}
              onChange={handleCostSliderChange}
              style={{ width: 400 }}
            />
          </div>
          <Button onClick={handleClearFilters} disabled={!isFiltering}>
            Clear Filters
          </Button>
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
        Do you want to proceed and delete this club? Please note that it can't
        be undone thereafter.
      </Modal>
      {!isLoading && loadedClubs && (
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

export default Clubs;
