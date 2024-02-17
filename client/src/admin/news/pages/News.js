import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Table, Space, Flex, Button, Modal, Image, message } from "antd";
import moment from "moment";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const News = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedNews, setLoadedNews] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedNewId, setDeletedNewId] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/admins/news"
        );

        setLoadedNews(responseData.news);
      } catch (err) {}
    };
    fetchNews();
  }, [sendRequest]);

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
      title: "Author",
      dataIndex: "author",
      key: "author",
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
              <Button>Edit</Button>
            </Link>
            <Button danger onClick={() => showModalForDelete(n.key)}>
              Delete
            </Button>
          </Flex>
        </Space>
      ),
    },
  ];

  const data = loadedNews
    ? loadedNews.map((n) => ({
        id: n.id,
        image: n.image,
        title: n.title,
        description: n.description,
        date: n.date,
        author: n.author ? n.author.surname : "Not found",
      }))
    : [];

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading ? (
        <div className="center">
          <LoadingSpinner />
        </div>
      ) : (
        <Link to="/admins/news/new">
          <Button
            type="primary"
            style={{
              fontSize: "16px",
            }}
          >
            Add News
          </Button>
        </Link>
      )}
      <div
        style={{
          height: 20,
        }}
      ></div>
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
        <Table
          columns={columns}
          dataSource={data.map((news, index) => ({
            ...news,
            key: news.id,
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

export default News;
