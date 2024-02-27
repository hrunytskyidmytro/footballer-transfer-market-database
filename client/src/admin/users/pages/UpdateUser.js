import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Form, Input, Button, Card } from "antd";

import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const UpdateUser = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const userId = useParams().userId;
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/users/${userId}`
        );
        setLoadedUsers(responseData.user);
        form.setFieldsValue({
          name: responseData.user.name,
          surname: responseData.user.surname,
          email: responseData.user.email,
        });
      } catch (err) {}
    };

    fetchUser();
  }, [sendRequest, userId, form]);

  const userSubmitHandler = async (values) => {
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/users/${userId}`,
        "PATCH",
        JSON.stringify({
          name: values.name,
          surname: values.surname,
          email: values.email,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/users");
      message.success("User successfully edited!");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedUsers && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find user!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedUsers && (
        <Form
          form={form}
          onFinish={userSubmitHandler}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the user's name!",
              },
              { max: 20, message: "Name must be at most 20 characters!" },
            ]}
          >
            <Input
              count={{
                show: true,
                max: 20,
              }}
            />
          </Form.Item>
          <Form.Item
            label="Surname"
            name="surname"
            rules={[
              {
                required: true,
                message: "Please input the user's surname!",
              },
              { max: 20, message: "Surname must be at most 20 characters!" },
            ]}
          >
            <Input
              count={{
                show: true,
                max: 20,
              }}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input the user's email!",
              },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
              {
                max: 20,
                message: "Email must be at most 20 characters!",
              },
            ]}
          >
            <Input type="email" addonAfter={"@"} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update User
            </Button>
          </Form.Item>
        </Form>
      )}
    </React.Fragment>
  );
};

export default UpdateUser;
