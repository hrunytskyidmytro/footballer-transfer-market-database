import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Form, Input, Button, Card, Spin } from "antd";
import { StarOutlined } from "@ant-design/icons";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const UpdateRating = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedRatings, setLoadedRatings] = useState();
  const { ratingId } = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/ratings/${ratingId}`
        );
        setLoadedRatings(responseData.rating);
        form.setFieldsValue({
          rating: responseData.rating.rating,
        });
      } catch (err) {}
    };

    fetchRating();
  }, [sendRequest, ratingId, form]);

  const ratingSubmitHandler = async (values) => {
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/ratings/${ratingId}`,
        "PATCH",
        JSON.stringify({
          rating: values.rating,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      navigate("/admins/ratings");
      message.success("Rating successfully edited!");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <Spin size="large" />
      </div>
    );
  }

  if (!loadedRatings && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find rating!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedRatings && (
        <Form
          form={form}
          onFinish={ratingSubmitHandler}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            name="rating"
            label="Rating"
            rules={[
              {
                required: true,
                message: "Please input the footballer's rating!",
              },
            ]}
          >
            <Input
              type="number"
              min={0}
              max={5}
              addonAfter={<StarOutlined />}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Rating
            </Button>
          </Form.Item>
        </Form>
      )}
    </React.Fragment>
  );
};

export default UpdateRating;
