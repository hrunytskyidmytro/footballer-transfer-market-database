import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Form, Input, Button, Card, Spin } from "antd";
import { EuroCircleOutlined } from "@ant-design/icons";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const UpdateClub = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedClubs, setLoadedClubs] = useState();
  const { clubId } = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/clubs/${clubId}`
        );
        setLoadedClubs(responseData.club);
        form.setFieldsValue({
          name: responseData.club.name,
          country: responseData.club.country,
          description: responseData.club.description,
          cost: responseData.club.cost,
          foundationYear: responseData.club.foundationYear,
        });
      } catch (err) {}
    };

    fetchClub();
  }, [sendRequest, clubId, form]);

  const clubSubmitHandler = async (values) => {
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/clubs/${clubId}`,
        "PATCH",
        JSON.stringify({
          name: values.name,
          country: values.country,
          description: values.description,
          cost: values.cost,
          foundationYear: values.foundationYear,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/clubs");
      message.success("Club successfully edited!");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <Spin size="large" />
      </div>
    );
  }

  if (!loadedClubs && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find club!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedClubs && (
        <Form
          form={form}
          onFinish={clubSubmitHandler}
          initialValues={{
            remember: true,
          }}
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
            />
          </Form.Item>
          <Form.Item
            label="Cost"
            name="cost"
            rules={[
              { required: true, message: "Please input the club's cost!" },
            ]}
          >
            <Input type="number" addonAfter={<EuroCircleOutlined />} />
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
            <Input type="number" addonAfter={"year"} />
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
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Club
            </Button>
          </Form.Item>
        </Form>
      )}
    </React.Fragment>
  );
};

export default UpdateClub;
