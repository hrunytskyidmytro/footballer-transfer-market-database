import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, message, Form, Input, Button, Upload, DatePicker } from "antd";
import { UploadOutlined, EuroCircleOutlined } from "@ant-design/icons";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const { Option } = Select;

const NewFootballer = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [agents, setAgents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchAgentsAndClubs = async () => {
      try {
        const agentsResponse = await sendRequest(
          "http://localhost:5001/api/admins/agents"
        );
        setAgents(agentsResponse.agents);

        const clubsResponse = await sendRequest(
          "http://localhost:5001/api/admins/clubs"
        );
        setClubs(clubsResponse.clubs);
      } catch (err) {}
    };
    fetchAgentsAndClubs();
  }, [sendRequest]);

  const footballerSubmitHandler = async (values) => {
    if (auth.role !== "admin") {
      console.log("You do not have permission to perform this action.");
      return;
    }

    try {
      const imageFile = values.image[0].originFileObj;
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("surname", values.surname);
      formData.append("nationality", values.nationality);
      formData.append("birthDate", values.birthDate);
      formData.append("weight", values.weight);
      formData.append("height", values.height);
      formData.append("age", values.age);
      formData.append("foot", values.foot);
      formData.append("contractUntil", values.contractUntil);
      formData.append("placeOfBirth", values.placeOfBirth);
      formData.append("mainPosition", values.mainPosition);
      formData.append("additionalPosition", values.additionalPosition);
      formData.append("cost", values.cost);
      formData.append("agent", values.agent);
      formData.append("club", values.club);
      formData.append("image", imageFile);

      await sendRequest(
        "http://localhost:5001/api/admins/footballers/new",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/footballers");
      message.success("Footballer successfully added!");
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
        onFinish={footballerSubmitHandler}
        initialValues={{ remember: true }}
        encType="multipart/form-data"
      >
        {isLoading && <LoadingSpinner asOverlay />}
        <Form.Item
          name="agent"
          rules={[{ required: true, message: "Please select an agent!" }]}
        >
          <Select placeholder="Select agent">
            {agents.map((agent) => (
              <Option key={agent.id} value={agent.id}>
                {agent.name} {agent.surname}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="club"
          rules={[{ required: true, message: "Please select a club!" }]}
        >
          <Select placeholder="Select club">
            {clubs.map((club) => (
              <Option key={club.id} value={club.id}>
                {club.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input the footballer's name!" },
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
            placeholder="Enter the surname"
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
            { max: 20, message: "Nationality must be at most 20 characters!" },
          ]}
        >
          <Input
            count={{
              show: true,
              max: 20,
            }}
            placeholder="Enter the nationality"
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
          <DatePicker style={{ width: "100%" }} />
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
          <Input
            type="number"
            placeholder="Enter the weight"
            addonAfter={"kg"}
          />
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
          <Input
            type="number"
            placeholder="Enter the height"
            addonAfter={"m"}
          />
        </Form.Item>
        <Form.Item
          label="Age"
          name="age"
          rules={[
            { required: true, message: "Please input the footballer's age!" },
          ]}
        >
          <Input type="number" placeholder="Enter the age" addonAfter="years" />
        </Form.Item>
        <Form.Item
          label="Foot"
          name="foot"
          rules={[
            { required: true, message: "Please input the footballer's foot!" },
            { max: 10, message: "Foot must be at most 10 characters!" },
          ]}
        >
          <Input
            count={{
              show: true,
              max: 10,
            }}
            placeholder="Enter the foot"
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
          <DatePicker style={{ width: "100%" }} />
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
            placeholder="Enter the place of birth"
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
            { max: 20, message: "Foot must be at most 20 characters!" },
          ]}
        >
          <Input
            count={{
              show: true,
              max: 20,
            }}
            placeholder="Enter the main position"
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
            { max: 20, message: "Foot must be at most 20 characters!" },
          ]}
        >
          <Input
            count={{
              show: true,
              max: 20,
            }}
            placeholder="Enter the additional position"
          />
        </Form.Item>
        <Form.Item
          label="Cost"
          name="cost"
          rules={[
            { required: true, message: "Please input the footballer's cost!" },
          ]}
        >
          <Input
            type="number"
            addonAfter={<EuroCircleOutlined />}
            placeholder="Enter the cost"
          />
        </Form.Item>
        <Form.Item
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Please upload the footballer's image!",
            },
          ]}
        >
          <Upload
            name="image"
            action="/footballers/new"
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Footballer
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

export default NewFootballer;
