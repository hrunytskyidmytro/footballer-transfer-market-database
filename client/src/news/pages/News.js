import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Flex,
  Typography,
  message,
  Input,
  Select,
  Tooltip,
  Pagination,
  Spin,
} from "antd";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Clubs = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedNews, setLoadedNews] = useState();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/news/?search=${searchTerm}&sortBy=${sortCriteria}&sortDir=${sortDirection}&page=${currentPage}&pageSize=${pageSize}`
        );
        setLoadedNews(responseData.news);
        setTotalItems(responseData.totalItems);
      } catch (err) {}
    };
    fetchNews();
  }, [
    searchTerm,
    sortCriteria,
    sortDirection,
    currentPage,
    pageSize,
    sendRequest,
  ]);

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
      <Tooltip title="Search for a title" placement="top">
        <Input.Search
          placeholder="Search title..."
          onChange={handleSearch}
          enterButton
          style={{ width: 400 }}
        />
      </Tooltip>
      <br />
      <br />
      <Tooltip title="Select sorting criteria" placement="topRight">
        <Select
          defaultValue="title"
          onChange={handleSortCriteriaChange}
          style={{ width: 120, marginBottom: "1rem", marginRight: "1rem" }}
        >
          <Select.Option value="title">Title</Select.Option>
          <Select.Option value="date">Date</Select.Option>
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
      <Flex wrap="wrap" justify="center">
        {!isLoading &&
          loadedNews &&
          loadedNews.map((news) => (
            <Card
              key={news.id}
              hoverable
              style={{ width: 950, margin: 5 }}
              styles={{
                body: {
                  padding: 0,
                  overflow: "hidden",
                },
              }}
            >
              <Flex justify="space-between">
                <img
                  alt={news.name}
                  src={`http://localhost:5001/${news.image}`}
                  style={{ display: "block", width: 400 }}
                />
                <Flex
                  vertical
                  align="flex-end"
                  justify="space-between"
                  style={{
                    padding: 32,
                  }}
                >
                  <Typography.Title level={3} style={{ marginTop: 16 }}>
                    “{news.title}.”
                  </Typography.Title>
                  <Button
                    type="primary"
                    href={`news/${news.id}`}
                    key={news.id}
                    // target="_blank"
                    style={{ marginTop: 16 }}
                  >
                    Read more
                  </Button>
                </Flex>
              </Flex>
            </Card>
          ))}
      </Flex>
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
