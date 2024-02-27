import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { message, Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const NewAgent = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [form] = Form.useForm();

  const agentSubmitHandler = async (values) => {
    if (auth.role !== "admin") {
      console.log("You do not have permission to perform this action.");
      return;
    }

    try {
      const imageFile = values.image[0].originFileObj;
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("surname", values.surname);
      formData.append("country", values.country);
      formData.append("email", values.email);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("description", values.description);
      formData.append("image", imageFile);
      await sendRequest(
        "http://localhost:5001/api/admins/agents/new",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/agents");
      message.success("Agent successfully added!");
    } catch (err) {}
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Form
        form={form}
        onFinish={agentSubmitHandler}
        initialValues={{ remember: true }}
        encType="multipart/form-data"
      >
        {isLoading && <LoadingSpinner asOverlay />}
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
            placeholder="Enter the name"
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
            placeholder="Enter the surname"
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
            placeholder="Enter the country"
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
          <Input type="email" addonAfter={"@"} placeholder="Enter the email" />
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
          <Input addonBefore="+380" placeholder="Enter the phone number" />
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
          <Input.TextArea rows={5} placeholder="Enter the description..." />
        </Form.Item>
        <Form.Item
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Please upload the agent's image!",
            },
          ]}
        >
          <Upload
            name="image"
            action="/agents/new"
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Agent
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

export default NewAgent;
