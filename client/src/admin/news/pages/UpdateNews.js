import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Form, Input, Button, Card } from "antd";

import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const UpdateNews = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedNews, setLoadedNews] = useState();
  const { newId } = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/news/${newId}`
        );
        setLoadedNews(responseData.n);
        form.setFieldsValue({
          title: responseData.n.title,
          description: responseData.n.description,
        });
      } catch (err) {}
    };

    fetchNews();
  }, [sendRequest, newId, form]);

  const newsSubmitHandler = async (values) => {
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/news/${newId}`,
        "PATCH",
        JSON.stringify({
          title: values.title,
          description: values.description,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/news");
      message.success("News successfully edited!");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedNews && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find news!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedNews && (
        <Form
          form={form}
          onFinish={newsSubmitHandler}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Please input the new's title!" },
              { max: 100, message: "Title must be at most 100 characters!" },
            ]}
          >
            <Input
              count={{
                show: true,
                max: 100,
              }}
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input the new's description!",
              },
              { min: 5, message: "Description must be at least 5 characters!" },
            ]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update News
            </Button>
          </Form.Item>
        </Form>
      )}
    </React.Fragment>
  );
};

export default UpdateNews;
