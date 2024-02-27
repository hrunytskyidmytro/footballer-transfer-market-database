import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { message, Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const NewNews = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [form] = Form.useForm();

  const NewsSubmitHandler = async (values) => {
    if (auth.role !== "admin") {
      console.log("You do not have permission to perform this action.");
      return;
    }

    try {
      const imageFile = values.image[0].originFileObj;
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("image", imageFile);
      await sendRequest(
        "http://localhost:5001/api/admins/news/new",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/news");
      message.success("News successfully added!");
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
        onFinish={NewsSubmitHandler}
        initialValues={{ remember: true }}
        encType="multipart/form-data"
      >
        {isLoading && <LoadingSpinner asOverlay />}
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
            placeholder="Enter the title"
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
          <Input.TextArea rows={5} placeholder="Enter the description..." />
        </Form.Item>
        <Form.Item
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Please upload the new's image!",
            },
          ]}
        >
          <Upload
            name="image"
            action="/news/new"
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add News
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

export default NewNews;
