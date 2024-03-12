import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Input,
  Select,
  Button,
  message,
  Divider,
  Pagination,
  Tooltip,
  Slider,
  Spin,
} from "antd";
import {
  EuroCircleOutlined,
  FilterOutlined,
  FilterFilled,
} from "@ant-design/icons";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Clubs = () => {
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
          `http://localhost:5001/api/clubs/?search=${searchTerm}&sortBy=${sortCriteria}&sortDir=${sortDirection}&country=${country}&yearFrom=${yearFrom}&yearTo=${yearTo}&costFrom=${costFrom}&costTo=${costTo}&page=${currentPage}&pageSize=${pageSize}`
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

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await sendRequest("http://localhost:5001/api/clubs/");
        const countries = response.clubs.map((club) => club.country);
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

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <Spin size="large" />
        </div>
      )}
      <br />
      <Tooltip title="Search for a club" placement="top">
        <Input.Search
          placeholder="Search clubs..."
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
          style={{ width: 140, marginBottom: "1rem", marginRight: "1rem" }}
        >
          <Select.Option value="name">Name</Select.Option>
          <Select.Option value="cost">Cost</Select.Option>
          <Select.Option value="foundationYear">Foundation year</Select.Option>
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
      <br />
      <br />
      {isFilterFormVisible && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 10,
            padding: "20px",
            marginBottom: "20px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Divider orientation="left">Country</Divider>
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
          <Divider orientation="left">Year</Divider>
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
          <br />
          <Divider orientation="left">Cost</Divider>
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
      <br />
      <br />
      <Card>
        {!isLoading &&
          loadedClubs &&
          loadedClubs.map((club) => (
            <Card.Grid
              key={club.id}
              hoverable={true}
              style={{ width: "25%", textAlign: "center" }}
            >
              <Link to={`/clubs/${club.id}`} key={club.id}>
                <img
                  alt={club.name}
                  src={`http://localhost:5001/${club.image}`}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "contain",
                  }}
                />
              </Link>
            </Card.Grid>
          ))}
      </Card>
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
    </>
  );
};

export default Clubs;
