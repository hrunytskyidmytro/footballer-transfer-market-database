import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Spin,
  Image,
  Input,
  Select,
  Radio,
  Button,
  message,
  Empty,
  Divider,
  Typography,
  Tooltip,
  Slider,
  Pagination,
} from "antd";
import {
  EuroCircleOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Footballers = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedFootballers, setLoadedFootballers] = useState();
  const [nationalitiesList, setNationalitiesList] = useState();
  const [positionsList, setPositionsList] = useState();
  const [clubsList, setClubsList] = useState();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [foot, setFoot] = useState("");
  const [nationality, setNationality] = useState("");
  const [position, setPosition] = useState("");
  const [selectedClub, setSelectedClub] = useState("");
  const [weightFrom, setWeightFrom] = useState("");
  const [weightTo, setWeightTo] = useState("");
  const [heightFrom, setHeightFrom] = useState("");
  const [heightTo, setHeightTo] = useState("");
  const [ageFrom, setAgeFrom] = useState("");
  const [ageTo, setAgeTo] = useState("");
  const [costFrom, setCostFrom] = useState("");
  const [costTo, setCostTo] = useState("");

  const [isFiltering, setIsFiltering] = useState(false);
  const [isFilterFormVisible, setIsFilterFormVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);
  const [weightError, setWeightError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [costError, setCostError] = useState("");

  useEffect(() => {
    const fetchFootballers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/footballers/?search=${searchTerm}&sortBy=${sortCriteria}&sortDir=${sortDirection}&foot=${foot}&nationality=${nationality}&mainPosition=${position}&weightFrom=${weightFrom}&weightTo=${weightTo}&heightFrom=${heightFrom}&heightTo=${heightTo}&ageFrom=${ageFrom}&ageTo=${ageTo}&costFrom=${costFrom}&costTo=${costTo}&club=${selectedClub}&page=${currentPage}&pageSize=${pageSize}`
        );

        setLoadedFootballers(responseData.footballers);
        setTotalItems(responseData.totalItems);
      } catch (err) {}
    };
    fetchFootballers();
  }, [
    searchTerm,
    sortCriteria,
    sortDirection,
    nationality,
    position,
    foot,
    weightFrom,
    weightTo,
    heightFrom,
    heightTo,
    ageFrom,
    ageTo,
    costFrom,
    costTo,
    selectedClub,
    currentPage,
    pageSize,
    sendRequest,
  ]);

  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/footballers/"
        );
        const nationalities = response.footballers.map(
          (footballer) => footballer.nationality
        );
        const uniqueNationalities = [...new Set(nationalities)];
        setNationalitiesList(uniqueNationalities);
      } catch (err) {}
    };
    fetchNationalities();
  }, [sendRequest]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/footballers/"
        );
        const positions = response.footballers.map(
          (footballer) => footballer.mainPosition
        );
        const uniquePositions = [...new Set(positions)];
        setPositionsList(uniquePositions);
      } catch (err) {}
    };
    fetchPositions();
  }, [sendRequest]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await sendRequest("http://localhost:5001/api/clubs/");
        const clubs = response.clubs.map((club) => club.name);
        setClubsList(clubs);
      } catch (err) {}
    };
    fetchClubs();
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

  const handleFootChange = (event) => {
    setFoot(event.target.value);
    setIsFiltering(true);
  };

  const handleNationalityChange = (value) => {
    setNationality(value);
    setIsFiltering(true);
  };

  const handlePositionChange = (value) => {
    setPosition(value);
    setIsFiltering(true);
  };

  const handleClubChange = (value) => {
    setSelectedClub(value);
    setIsFiltering(true);
  };

  const handleWeightFromChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > 100) {
      setWeightError("Weight must be between 0 and 100.");
    } else {
      setWeightError("");
      setWeightFrom(value);
      setIsFiltering(true);
    }
  };

  const handleWeightToChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > 100) {
      setWeightError("Weight must be between 0 and 100.");
    } else {
      setWeightError("");
      setWeightTo(value);
      setIsFiltering(true);
    }
  };

  const handleHeightFromChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > 220) {
      setHeightError("Height must be between 0 and 220.");
    } else {
      setHeightError("");
      setHeightFrom(value);
      setIsFiltering(true);
    }
  };

  const handleHeightToChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > 220) {
      setHeightError("Height must be between 0 and 220.");
    } else {
      setHeightError("");
      setHeightTo(value);
      setIsFiltering(true);
    }
  };

  const handleAgeFromChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > 60) {
      setAgeError("Age must be between 0 and 60.");
    } else {
      setAgeError("");
      setAgeFrom(value);
      setIsFiltering(true);
    }
  };

  const handleAgeToChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > 60) {
      setAgeError("Age must be between 0 and 60.");
    } else {
      setAgeError("");
      setAgeTo(value);
      setIsFiltering(true);
    }
  };

  const handleCostFromChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > 50000000) {
      setCostError("Cost must be between 0 and 50,000,000.");
    } else {
      setCostError("");
      setCostFrom(value);
      setIsFiltering(true);
    }
  };

  const handleCostToChange = (event) => {
    const value = event.target.value;

    if (value < 0 || value > 50000000) {
      setCostError("Cost must be between 0 and 50,000,000.");
    } else {
      setCostError("");
      setCostTo(value);
      setIsFiltering(true);
    }
  };

  const handleClearFilters = () => {
    setFoot("");
    setNationality("");
    setPosition("");
    setWeightFrom("");
    setWeightTo("");
    setHeightFrom("");
    setHeightTo("");
    setAgeFrom("");
    setAgeTo("");
    setCostFrom("");
    setCostTo("");
    setSelectedClub("");
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

  const handleCostSliderChange = (value) => {
    setCostFrom(value[0]);
    setCostTo(value[1]);
    setIsFiltering(true);
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
      <Tooltip title="Search for a footballer" placement="top">
        <Input.Search
          placeholder="Search footballers..."
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
          <Select.Option value="age">Age</Select.Option>
          <Select.Option value="birthDate">Birth date</Select.Option>
          <Select.Option value="weight">Weight</Select.Option>
          <Select.Option value="height">Height</Select.Option>
          <Select.Option value="cost">Cost</Select.Option>
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
            <UpOutlined /> Hide filters
          </>
        ) : (
          <>
            <DownOutlined /> Show filters
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
          }}
        >
          <Divider>| Nationality | Position | Club |</Divider>
          <Tooltip title="Select the player's nationality" placement="top">
            <Select
              placeholder="Select nationality"
              onChange={handleNationalityChange}
              value={nationality}
              style={{ width: 200 }}
            >
              <Select.Option value="">All Nationalities</Select.Option>
              {nationalitiesList &&
                nationalitiesList.map((nationality) => (
                  <Select.Option key={nationality} value={nationality}>
                    {nationality}
                  </Select.Option>
                ))}
            </Select>
          </Tooltip>
          <br />
          <br />
          <Tooltip title="Select the player's position" placement="top">
            <Select
              placeholder="Select position"
              onChange={handlePositionChange}
              value={position}
              style={{ width: 200 }}
            >
              <Select.Option value="">All Positions</Select.Option>
              {positionsList &&
                positionsList.map((position) => (
                  <Select.Option key={position} value={position}>
                    {position}
                  </Select.Option>
                ))}
            </Select>
          </Tooltip>
          <br />
          <br />
          <Tooltip title="Select the player's club" placement="top">
            <Select
              placeholder="Select club"
              onChange={handleClubChange}
              value={selectedClub}
              style={{ width: 200 }}
            >
              <Select.Option value="">All Clubs</Select.Option>
              {clubsList &&
                clubsList.map((club) => (
                  <Select.Option key={club} value={club}>
                    {club}
                  </Select.Option>
                ))}
            </Select>
          </Tooltip>
          <br />
          <br />
          <Divider>| Characteristics |</Divider>
          {weightError && <p style={{ color: "red" }}>{weightError}</p>}
          <Tooltip title="Enter the minimum weight" placement="top">
            <Input
              type="number"
              placeholder="Weight from"
              value={weightFrom}
              min={0}
              max={100}
              onChange={handleWeightFromChange}
              style={{ width: 220, marginBottom: "1rem", marginRight: "1rem" }}
              addonAfter={"kg"}
            />
          </Tooltip>
          <Tooltip title="Enter the maximum weight" placement="top">
            <Input
              type="number"
              placeholder="Weight to"
              value={weightTo}
              min={0}
              max={100}
              onChange={handleWeightToChange}
              style={{ width: 220, marginBottom: "1rem" }}
              addonAfter={"kg"}
            />
          </Tooltip>
          <br />
          {heightError && <p style={{ color: "red" }}>{heightError}</p>}
          <Tooltip title="Enter the minimum height" placement="top">
            <Input
              type="number"
              placeholder="Height from"
              value={heightFrom}
              min={0}
              max={220}
              onChange={handleHeightFromChange}
              style={{ width: 220, marginBottom: "1rem", marginRight: "1rem" }}
              addonAfter={"m"}
            />
          </Tooltip>
          <Tooltip title="Enter the maximum height" placement="top">
            <Input
              type="number"
              placeholder="Height to"
              value={heightTo}
              min={0}
              max={220}
              onChange={handleHeightToChange}
              style={{ width: 220, marginBottom: "1rem" }}
              addonAfter={"m"}
            />
          </Tooltip>
          <br />
          {ageError && <p style={{ color: "red" }}>{ageError}</p>}
          <Tooltip title="Enter the minimum age" placement="top">
            <Input
              type="number"
              placeholder="Age from"
              value={ageFrom}
              min={0}
              max={60}
              onChange={handleAgeFromChange}
              style={{ width: 220, marginBottom: "1rem", marginRight: "1rem" }}
              addonAfter={"Y"}
            />
          </Tooltip>
          <Tooltip title="Enter the maximum age" placement="top">
            <Input
              type="number"
              placeholder="Age to"
              value={ageTo}
              min={0}
              max={60}
              onChange={handleAgeToChange}
              style={{ width: 220, marginBottom: "1rem" }}
              addonAfter={"Y"}
            />
          </Tooltip>
          <br />
          <Divider>| Cost |</Divider>
          {costError && <p style={{ color: "red" }}>{costError}</p>}
          <Tooltip title="Select the minimum player's cost" placement="top">
            <Input
              type="number"
              placeholder="Cost from"
              value={costFrom}
              min={0}
              max={50000000}
              onChange={handleCostFromChange}
              style={{ width: 220, marginBottom: "1rem", marginRight: "1rem" }}
              addonAfter={<EuroCircleOutlined />}
            />
          </Tooltip>
          <Tooltip title="Select the maximum player's cost" placement="top">
            <Input
              type="number"
              placeholder="Cost to"
              value={costTo}
              min={0}
              max={50000000}
              onChange={handleCostToChange}
              style={{ width: 220, marginBottom: "1rem" }}
              addonAfter={<EuroCircleOutlined />}
            />
          </Tooltip>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Slider
              range
              min={0}
              max={50000000}
              step={1}
              value={[costFrom, costTo]}
              defaultValue={[0, 100]}
              onChange={handleCostSliderChange}
              style={{ width: 400 }}
            />
          </div>
          <br />
          <br />
          <Divider>| Foot |</Divider>
          <Radio.Group onChange={handleFootChange} value={foot}>
            <Radio value="Right">Right Footed</Radio>
            <Radio value="Left">Left Footed</Radio>
            <Radio value="">Any</Radio>
          </Radio.Group>
          <br />
          <br />
          <Button onClick={handleClearFilters} disabled={!isFiltering}>
            Clear Filters
          </Button>
        </div>
      )}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {!isLoading && loadedFootballers && loadedFootballers.length === 0 && (
          <Empty />
        )}
        {!isLoading &&
          loadedFootballers &&
          loadedFootballers.map((footballer) => (
            <Link to={`/footballers/${footballer.id}`} key={footballer.id}>
              <Card
                key={footballer.id}
                hoverable
                style={{ width: 200, margin: 20 }}
                cover={
                  <img
                    alt={`${footballer.name} ${footballer.surname}`}
                    src={`http://localhost:5001/${footballer.image}`}
                  />
                }
              >
                <Card.Meta
                  title={`${footballer.name} ${footballer.surname}`}
                  description={
                    <Typography.Title level={4}>
                      <Image
                        width={50}
                        src={`http://localhost:5001/${footballer.club.image}`}
                        preview={false}
                      />
                    </Typography.Title>
                  }
                />
              </Card>
            </Link>
          ))}
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
    </React.Fragment>
  );
};

export default Footballers;
