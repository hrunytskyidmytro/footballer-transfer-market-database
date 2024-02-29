import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Form, Input, Button, Card, Spin } from "antd";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const UpdateAgent = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedAgents, setLoadedAgents] = useState();
  const { agentId } = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/agents/${agentId}`
        );
        setLoadedAgents(responseData.agent);
        form.setFieldsValue({
          name: responseData.agent.name,
          surname: responseData.agent.surname,
          country: responseData.agent.country,
          email: responseData.agent.email,
          phoneNumber: responseData.agent.phoneNumber,
          description: responseData.agent.description,
        });
      } catch (err) {}
    };

    fetchAgent();
  }, [sendRequest, agentId, form]);

  const agentSubmitHandler = async (values) => {
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/agents/${agentId}`,
        "PATCH",
        JSON.stringify({
          name: values.name,
          surname: values.surname,
          country: values.country,
          email: values.email,
          phoneNumber: values.phoneNumber,
          description: values.description,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/agents");
      message.success("Agent successfully edited!");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <Spin size="large" />
      </div>
    );
  }

  if (!loadedAgents && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find agent!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedAgents && (
        <Form
          form={form}
          onFinish={agentSubmitHandler}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the agent's name!" },
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
                message: "Please input the agent's surname!",
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
            label="Country"
            name="country"
            rules={[
              {
                required: true,
                message: "Please input the agent's country!",
              },
              { max: 20, message: "Country must be at most 20 characters!" },
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
                message: "Please input the agent's email!",
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
          <Form.Item
            label="Phone number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input the agent's phone number!",
              },
            ]}
          >
            <Input addonBefore="+380" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input the agent's description!",
              },
              { min: 5, message: "Description must be at least 5 characters!" },
            ]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Agent
            </Button>
          </Form.Item>
        </Form>
      )}
    </React.Fragment>
  );
};

export default UpdateAgent;
