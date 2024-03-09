import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Space,
  Table,
  Image,
  Flex,
  Button,
  Rate,
  Typography,
  Modal,
  Spin,
  Pagination,
  message,
} from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import moment from "moment";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const Ratings = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedRatings, setLoadedRatings] = useState();
  const [namesList, setNamesList] = useState();
  const [surnamesList, setSurnamesList] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedRatingId, setDeletedRatingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/ratings/?page=${currentPage}&pageSize=${pageSize}`
        );
        setLoadedRatings(responseData.ratings);
        setTotalItems(responseData.totalItems);
      } catch (err) {}
    };
    fetchRatings();
  }, [currentPage, pageSize, sendRequest]);

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/ratings/"
        );
        const names = response.ratings.map((rating) => rating.footballer.name);
        const uniqueNames = [...new Set(names)];
        setNamesList(uniqueNames);
      } catch (err) {}
    };
    fetchNames();
  }, [sendRequest]);

  useEffect(() => {
    const fetchSurnames = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5001/api/ratings/"
        );
        const surnames = response.ratings.map(
          (rating) => rating.footballer.surname
        );
        const uniqueSurnames = [...new Set(surnames)];
        setSurnamesList(uniqueSurnames);
      } catch (err) {}
    };
    fetchSurnames();
  }, [sendRequest]);

  const confirmDeleteHandler = async () => {
    setIsModalOpen(false);
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/ratings/${deletedRatingId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setDeletedRatingId(null);
      setLoadedRatings((prevRatings) =>
        prevRatings.filter((rating) => rating.id !== deletedRatingId)
      );
      message.success("Rating successfully deleted!");
    } catch (err) {}
  };

  const showModalForDelete = (id) => {
    setIsModalOpen(true);
    setDeletedRatingId(id);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
      title: "Footballer image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image width={100} src={`http://localhost:5001/${image}`} />
      ),
    },
    {
      title: "Footballer name",
      dataIndex: "footballer_name",
      key: "footballer_name",
      filters:
        namesList &&
        namesList.map((name) => ({
          text: name,
          value: name,
        })),
      onFilter: (value, record) => record.footballer_name.indexOf(value) === 0,
    },
    {
      title: "Footballer surname",
      dataIndex: "footballer_surname",
      key: "footballer_surname",
      filters:
        surnamesList &&
        surnamesList.map((surname) => ({
          text: surname,
          value: surname,
        })),
      onFilter: (value, record) =>
        record.footballer_surname.indexOf(value) === 0,
    },
    {
      title: "User name",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "User surname",
      dataIndex: "user_surname",
      key: "user_surname",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => a.date - b.date,
      render: (text) => moment(text).format("MMMM Do YYYY"),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      sorter: (a, b) => a.rating - b.rating,
      render: (rating) => (
        <Space>
          <Rate disabled defaultValue={rating} allowHalf />
          <Typography.Text code>{rating}</Typography.Text>
        </Space>
      ),
    },
    {
      key: "action",
      render: (rating) => (
        <Space size="middle">
          <Flex gap="small">
            <Link to={`/admins/ratings/${rating.key}`}>
              <Button>
                <EditTwoTone />
              </Button>
            </Link>
            <Button danger onClick={() => showModalForDelete(rating.key)}>
              <DeleteTwoTone twoToneColor="#eb2f96" />
            </Button>
          </Flex>
        </Space>
      ),
    },
  ];

  const data = loadedRatings
    ? loadedRatings.map((rating) => ({
        key: rating.id,
        image: rating.footballer ? rating.footballer.image : "Not found",
        footballer_name: rating.footballer
          ? rating.footballer.name
          : "Not found",
        footballer_surname: rating.footballer
          ? rating.footballer.surname
          : "Not found",
        user_name: rating.user.name ? rating.user.name : "Not found",
        user_surname: rating.user.surname ? rating.user.surname : "Not found",
        rating: rating.rating,
        date: rating.date,
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
      <Modal
        title="Are you sure?"
        open={isModalOpen}
        onOk={confirmDeleteHandler}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        Do you want to proceed and delete this rating? Please note that it can't
        be undone thereafter.
      </Modal>
      {!isLoading && (
        <div style={{ width: "100%", overflowX: "auto" }}>
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
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

export default Ratings;
