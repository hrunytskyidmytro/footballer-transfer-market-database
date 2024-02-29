import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Form, Input, Button, DatePicker, Card, Spin } from "antd";
import { EuroCircleOutlined } from "@ant-design/icons";
import moment from "moment";

import ErrorModal from "../../../shared/components/UIElements/ErrorModal";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const UpdateTransfer = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedTransfers, setLoadedTransfers] = useState();
  const { transferId } = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchTransfer = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/transfers/${transferId}`
        );
        setLoadedTransfers(responseData.transfer);
        form.setFieldsValue({
          transferFee: responseData.transfer.transferFee,
          transferType: responseData.transfer.transferType,
          transferDate: moment(responseData.transfer.transferDate),
          season: responseData.transfer.season,
          compensationAmount: responseData.transfer.compensationAmount,
          contractTransferUntil: moment(
            responseData.transfer.contractTransferUntil
          ),
        });
      } catch (err) {}
    };

    fetchTransfer();
  }, [sendRequest, transferId, form]);

  const transferSubmitHandler = async (values) => {
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/transfers/${transferId}`,
        "PATCH",
        JSON.stringify({
          transferFee: values.transferFee,
          transferType: values.transferType,
          transferDate: values.transferDate.format("YYYY-MM-DD"),
          season: values.season,
          compensationAmount: values.compensationAmount,
          contractTransferUntil:
            values.contractTransferUntil.format("YYYY-MM-DD"),
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/transfers");
      message.success("Transfer successfully edited!");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <Spin size="large" />
      </div>
    );
  }

  if (!loadedTransfers && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find transfer!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedTransfers && (
        <Form
          form={form}
          onFinish={transferSubmitHandler}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            name="transferFee"
            label="Transfer Fee"
            rules={[
              { required: true, message: "Please input the transfer's fee!" },
            ]}
          >
            <Input type="number" addonAfter={<EuroCircleOutlined />} />
          </Form.Item>
          <Form.Item
            name="transferDate"
            label="Transfer Date"
            rules={[
              { required: true, message: "Please select the transfer's date!" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="transferType"
            label="Transfer Type"
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
            />
          </Form.Item>
          <Form.Item
            name="contractTransferUntil"
            label="Contract transfer until"
            rules={[
              {
                required: true,
                message: "Please select the transfer's contract until!",
              },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="season"
            label="Season"
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
            />
          </Form.Item>
          <Form.Item
            name="compensationAmount"
            label="Compensation Amount"
            rules={[
              {
                required: true,
                message: "Please input the transfer's compensation amount!",
              },
            ]}
          >
            <Input type="number" addonAfter={<EuroCircleOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Transfer
            </Button>
          </Form.Item>
        </Form>
      )}
    </React.Fragment>
  );
};

export default UpdateTransfer;
