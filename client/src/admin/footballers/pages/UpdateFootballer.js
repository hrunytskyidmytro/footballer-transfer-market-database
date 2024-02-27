import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Form, Input, Button, DatePicker, Card } from "antd";
import { EuroCircleOutlined } from "@ant-design/icons";
import moment from "moment";

import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const UpdateFootballer = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedFootballers, setLoadedFootballers] = useState();
  const { footballerId } = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchFootballer = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/footballers/${footballerId}`
        );
        setLoadedFootballers(responseData.footballer);
        form.setFieldsValue({
          name: responseData.footballer.name,
          surname: responseData.footballer.surname,
          nationality: responseData.footballer.nationality,
          birthDate: moment(responseData.footballer.birthDate),
          weight: responseData.footballer.weight,
          height: responseData.footballer.height,
          age: responseData.footballer.age,
          foot: responseData.footballer.foot,
          contractUntil: moment(responseData.footballer.contractUntil),
          placeOfBirth: responseData.footballer.placeOfBirth,
          mainPosition: responseData.footballer.mainPosition,
          additionalPosition: responseData.footballer.additionalPosition,
          cost: responseData.footballer.cost,
        });
      } catch (err) {}
    };

    fetchFootballer();
  }, [sendRequest, footballerId, form]);

  const footballerSubmitHandler = async (values) => {
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/footballers/${footballerId}`,
        "PATCH",
        JSON.stringify({
          name: values.name,
          surname: values.surname,
          nationality: values.nationality,
          birthDate: values.birthDate.format("YYYY-MM-DD"),
          weight: values.weight,
          height: values.height,
          age: values.age,
          foot: values.foot,
          contractUntil: values.contractUntil.format("YYYY-MM-DD"),
          placeOfBirth: values.placeOfBirth,
          mainPosition: values.mainPosition,
          additionalPosition: values.additionalPosition,
          cost: values.cost,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/footballers");
      message.success("Footballer successfully edited!");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedFootballers && !error) {
    return (
      <Card>
        <h2>Could not find footballer!</h2>
      </Card>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedFootballers && (
        <Form
          form={form}
          onFinish={footballerSubmitHandler}
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
                message: "Please input the footballer's name!",
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
                message: "Please input the footballer's surname!",
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
            label="Nationality"
            name="nationality"
            rules={[
              {
                required: true,
                message: "Please input the footballer's nationality!",
              },
              {
                max: 20,
                message: "Nationality must be at most 20 characters!",
              },
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
            label="Date of birth"
            name="birthDate"
            rules={[
              {
                required: true,
                message: "Please input the footballer's birth date!",
              },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Weight"
            name="weight"
            rules={[
              {
                required: true,
                message: "Please input the footballer's weight!",
              },
            ]}
          >
            <Input type="number" addonAfter={"kg"} />
          </Form.Item>
          <Form.Item
            label="Height"
            name="height"
            rules={[
              {
                required: true,
                message: "Please input the footballer's height!",
              },
            ]}
          >
            <Input type="number" addonAfter={"m"} />
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
            rules={[
              { required: true, message: "Please input the footballer's age!" },
            ]}
          >
            <Input type="number" addonAfter="years" />
          </Form.Item>
          <Form.Item
            label="Foot"
            name="foot"
            rules={[
              {
                required: true,
                message: "Please input the footballer's foot!",
              },
              { max: 10, message: "Foot must be at most 10 characters!" },
            ]}
          >
            <Input
              count={{
                show: true,
                max: 10,
              }}
            />
          </Form.Item>
          <Form.Item
            label="Contract until"
            name="contractUntil"
            rules={[
              {
                required: true,
                message: "Please input the footballer's contract until!",
              },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Place of birth"
            name="placeOfBirth"
            rules={[
              {
                required: true,
                message: "Please input the footballer's place of birth!",
              },
              { max: 20, message: "Foot must be at most 20 characters!" },
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
            label="Main position"
            name="mainPosition"
            rules={[
              {
                required: true,
                message: "Please input the footballer's main position!",
              },
              {
                max: 20,
                message: "Main position must be at most 20 characters!",
              },
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
            label="Additional position"
            name="additionalPosition"
            rules={[
              {
                required: true,
                message: "Please input the footballer's additional position!",
              },
              {
                max: 20,
                message: "Additional position must be at most 20 characters!",
              },
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
              {
                required: true,
                message: "Please input the footballer's cost!",
              },
            ]}
          >
            <Input type="number" addonAfter={<EuroCircleOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Footballer
            </Button>
          </Form.Item>
        </Form>
      )}
    </React.Fragment>
  );
};

export default UpdateFootballer;
