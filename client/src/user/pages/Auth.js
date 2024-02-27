import React, { useState, useContext } from "react";
import { Card, Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [form] = Form.useForm();

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (values) => {
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/users/login",
          "POST",
          JSON.stringify({
            email: values.email,
            password: values.password,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        auth.login(responseData.userId, responseData.token, responseData.role);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("name", values.name);
        formData.append("password", values.password);
        formData.append("surname", values.surname);
        const responseData = await sendRequest(
          "http://localhost:5001/api/users/signup",
          "POST",
          formData
        );
        auth.login(responseData.userId, responseData.token, responseData.role);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLoginMode ? "Log In" : "Sign Up"}</h2>
        <Form form={form} onFinish={authSubmitHandler}>
          {!isLoginMode && (
            <Form.Item
              name="name"
              rules={[
                { required: true, message: "Please input your name!" },
                { max: 20, message: "Name must be at most 20 characters!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Your Name"
              />
            </Form.Item>
          )}
          {!isLoginMode && (
            <Form.Item
              name="surname"
              rules={[
                { required: true, message: "Please input your surname!" },
                { max: 20, message: "Surname must be at most 20 characters!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Your Surname"
              />
            </Form.Item>
          )}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please input a valid email address!" },
              { max: 20, message: "Email must be at most 20 characters!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="E-Mail"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
              { max: 20, message: "Password must be at most 20 characters!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {isLoginMode ? "Log In" : "Sign Up"}
            </Button>
          </Form.Item>
        </Form>
        <Button type="link" onClick={switchModeHandler}>
          {isLoginMode ? "Sign Up" : "Log In"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
