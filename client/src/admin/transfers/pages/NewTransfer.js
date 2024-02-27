import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, message, Form, Input, Button, DatePicker } from "antd";
import { EuroCircleOutlined } from "@ant-design/icons";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const { Option } = Select;

const NewTransfer = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [footballers, setFootballers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchFootballersAndClubs = async () => {
      try {
        const footballersResponse = await sendRequest(
          "http://localhost:5001/api/admins/footballers"
        );
        setFootballers(footballersResponse.footballers);

        const clubsResponse = await sendRequest(
          "http://localhost:5001/api/admins/clubs"
        );
        setClubs(clubsResponse.clubs);
      } catch (err) {}
    };
    fetchFootballersAndClubs();
  }, [sendRequest]);

  const transferSubmitHandler = async (values) => {
    if (auth.role !== "admin") {
      console.log("You do not have permission to perform this action.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("footballer", values.footballer);
      formData.append("fromClub", values.fromClub);
      formData.append("toClub", values.toClub);
      formData.append("transferFee", values.transferFee);
      formData.append("transferDate", values.transferDate);
      formData.append("transferType", values.transferType);
      formData.append("season", values.season);
      formData.append("compensationAmount", values.compensationAmount);
      formData.append("contractTransferUntil", values.contractTransferUntil);
      await sendRequest(
        "http://localhost:5001/api/admins/transfers/new",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/transfers");
      message.success("Transfer successfully added!");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Form
        form={form}
        onFinish={transferSubmitHandler}
        initialValues={{ remember: true }}
        encType="multipart/form-data"
      >
        {isLoading && <LoadingSpinner asOverlay />}
        <Form.Item
          name="footballer"
          rules={[{ required: true, message: "Please select an footballer!" }]}
        >
          <Select placeholder="Select footballer">
            {footballers.map((footballer) => (
              <Option key={footballer.id} value={footballer.id}>
                {footballer.name} {footballer.surname}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="fromClub"
          rules={[{ required: true, message: "Please select an from club!" }]}
        >
          <Select id="fromClub" placeholder="Select from club">
            {clubs.map((club) => (
              <Option key={club.id} value={club.id}>
                {club.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="toClub"
          rules={[{ required: true, message: "Please select an to club!" }]}
        >
          <Select id="toClub" placeholder="Select to club">
            {clubs.map((club) => (
              <Option key={club.id} value={club.id}>
                {club.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Transfer Fee"
          name="transferFee"
          rules={[
            { required: true, message: "Please input the transfer's fee!" },
          ]}
        >
          <Input
            type="number"
            addonAfter={<EuroCircleOutlined />}
            placeholder="Enter the transfer fee"
          />
        </Form.Item>
        <Form.Item
          label="Transfer Date"
          name="transferDate"
          rules={[
            { required: true, message: "Please select the transfer's date!" },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Transfer Type"
          name="transferType"
          rules={[
            { required: true, message: "Please input the transfer's type!" },
            {
              max: 20,
              message: "Transfer type must be at most 20 characters!",
            },
          ]}
        >
          <Input
            count={{
              show: true,
              max: 20,
            }}
            placeholder="Enter the type"
          />
        </Form.Item>
        <Form.Item
          label="Contract transfer until"
          name="contractTransferUntil"
          rules={[
            {
              required: true,
              message: "Please select the transfer's contract until!",
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Season"
          name="season"
          rules={[
            { required: true, message: "Please input the season!" },
            { max: 10, message: "Season must be at most 10 characters!" },
          ]}
        >
          <Input
            count={{
              show: true,
              max: 10,
            }}
            placeholder="Enter the season"
          />
        </Form.Item>
        <Form.Item
          label="Compensation Amount"
          name="compensationAmount"
          rules={[
            {
              required: true,
              message: "Please input the transfer's compensation amount!",
            },
          ]}
        >
          <Input
            type="number"
            addonAfter={<EuroCircleOutlined />}
            placeholder="Enter the amount"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Transfer
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

export default NewTransfer;
