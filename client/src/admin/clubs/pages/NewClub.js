import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { message, Form, Input, Button, Upload, Spin } from "antd";
import { UploadOutlined, EuroCircleOutlined } from "@ant-design/icons";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const NewClub = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [form] = Form.useForm();

  const clubSubmitHandler = async (values) => {
    if (auth.role !== "admin" && auth.role !== "football_manager") {
      console.log("You do not have permission to perform this action.");
      return;
    }

    try {
      const imageFile = values.image[0].originFileObj;
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("country", values.country);
      formData.append("description", values.description);
      formData.append("cost", values.cost);
      formData.append("foundationYear", values.foundationYear);
      formData.append("image", imageFile);
      await sendRequest(
        "http://localhost:5001/api/admins/clubs/new",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/clubs");
      message.success("Club successfully added!");
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
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <Form
          form={form}
          onFinish={clubSubmitHandler}
          initialValues={{ remember: true }}
          encType="multipart/form-data"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the club's name!" },
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
            label="Country"
            name="country"
            rules={[
              { required: true, message: "Please input the club's country!" },
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
            label="Cost"
            name="cost"
            rules={[
              { required: true, message: "Please input the club's cost!" },
            ]}
          >
            <Input
              type="number"
              addonAfter={<EuroCircleOutlined />}
              placeholder="Enter the cost"
            />
          </Form.Item>
          <Form.Item
            label="Foundation year"
            name="foundationYear"
            rules={[
              {
                required: true,
                message: "Please input the club's foundation year!",
              },
            ]}
          >
            <Input
              type="number"
              addonAfter={"year"}
              placeholder="Enter the foundation year"
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input the club's description!",
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
                message: "Please upload the club's image!",
              },
            ]}
          >
            <Upload
              name="image"
              action="/clubs/new"
              listType="picture"
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Club
            </Button>
          </Form.Item>
        </Form>
      )}
    </React.Fragment>
  );
};

export default NewClub;
