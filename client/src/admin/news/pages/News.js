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
  Pagination,
  Spin,
  message,
} from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import moment from "moment";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const News = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedNews, setLoadedNews] = useState();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedNewId, setDeletedNewId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/news?search=${searchTerm}&sortBy=${sortCriteria}&sortDir=${sortDirection}&page=${currentPage}&pageSize=${pageSize}`
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

  const confirmDeleteHandler = async () => {
    setIsModalOpen(false);
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/news/${deletedNewId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setDeletedNewId(null);
      setLoadedNews((prevNews) =>
        prevNews.filter((n) => n.id !== deletedNewId)
      );
      message.success("News successfully deleted!");
    } catch (err) {}
  };

  const showModalForDelete = (id) => {
    setIsModalOpen(true);
    setDeletedNewId(id);
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
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => moment(text).format("MMMM Do YYYY"),
    },
    {
      title: "Creator",
      dataIndex: "creator",
      key: "creator",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      key: "action",
      render: (n) => (
        <Space size="middle">
          <Flex gap="small">
            <Link to={`/admins/news/${n.key}`}>
              <Button>
                <EditTwoTone />
              </Button>
            </Link>
            <Button danger onClick={() => showModalForDelete(n.key)}>
              <DeleteTwoTone twoToneColor="#eb2f96" />
            </Button>
          </Flex>
        </Space>
      ),
    },
  ];

  const data = loadedNews
    ? loadedNews.map((n) => ({
        key: n.id,
        image: n.image,
        title: n.title,
        description: n.description,
        date: n.date,
        creator: n.creator ? n.creator.surname : "Not found",
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
          <Link to="/admins/news/new">
            <Button type="primary">Add News</Button>
          </Link>
        </div>
      )}
      <br />
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Tooltip title="Search for a title" placement="top">
          <Input.Search
            placeholder="Search title..."
            onChange={handleSearch}
            enterButton
            style={{ width: 400 }}
          />
        </Tooltip>
        <div>
          <Tooltip title="Select sorting criteria" placement="top">
            <Select
              defaultValue="title"
              onChange={handleSortCriteriaChange}
              style={{ width: 140, marginBottom: "1rem", marginRight: "1rem" }}
            >
              <Select.Option value="title">Title</Select.Option>
              <Select.Option value="date">Date</Select.Option>
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
      </div>
      <br />
      <Modal
        title="Are you sure?"
        open={isModalOpen}
        onOk={confirmDeleteHandler}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        Do you want to proceed and delete this news? Please note that it can't
        be undone thereafter.
      </Modal>
      {!isLoading && loadedNews && (
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

export default News;
