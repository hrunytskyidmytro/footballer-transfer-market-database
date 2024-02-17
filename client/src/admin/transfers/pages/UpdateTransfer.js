import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";

import Input from "../../../shared/components/FormElements/Input";
import Button from "../../../shared/components/FormElements/Button";
import Card from "../../../shared/components/UIElements/Card";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_DATE,
  VALIDATOR_NUMBER,
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
// import "./FootballerForm.css";

const UpdateTransfer = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedTransfers, setLoadedTransfers] = useState();
  const { transferId } = useParams();

  const [formState, inputHandler, setFormData] = useForm(
    {
      transferFee: {
        value: 0,
        isValid: false,
      },
      transferType: {
        value: "",
        isValid: false,
      },
      transferDate: {
        value: "",
        isValid: false,
      },
      season: {
        value: "",
        isValid: false,
      },
      compensationAmount: {
        value: 0,
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchTransfer = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/transfers/${transferId}`
        );
        setLoadedTransfers(responseData.transfer);
        setFormData(
          {
            transferFee: {
              value: responseData.transfer.transferFee,
              isValid: true,
            },
            transferType: {
              value: responseData.transfer.transferType,
              isValid: true,
            },
            transferDate: {
              value: responseData.transfer.transferDate,
              isValid: true,
            },
            season: {
              value: responseData.transfer.season,
              isValid: true,
            },
            compensationAmount: {
              value: responseData.transfer.compensationAmount,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };

    fetchTransfer();
  }, [sendRequest, transferId, setFormData]);

  const transferSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/transfers/${transferId}`,
        "PATCH",
        JSON.stringify({
          transferFee: formState.inputs.transferFee.value,
          transferType: formState.inputs.transferType.value,
          transferDate: formState.inputs.transferDate.value,
          season: formState.inputs.season.value,
          compensationAmount: formState.inputs.compensationAmount.value,
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
        <LoadingSpinner />
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
        <form className="transfer-form" onSubmit={transferSubmitHandler}>
          <Input
            id="transferFee"
            element="input"
            type="number"
            label="Transfer fee"
            validators={[VALIDATOR_NUMBER()]}
            errorText="Please enter a valid transfer fee."
            onInput={inputHandler}
            initialValue={loadedTransfers.transferFee}
            initialValid={true}
          />
          <Input
            id="transferType"
            element="input"
            type="text"
            label="Transfer type"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid transfer type."
            onInput={inputHandler}
            initialValue={loadedTransfers.transferType}
            initialValid={true}
          />
          <Input
            id="transferDate"
            element="input"
            type="date"
            label="Transfer date"
            validators={[VALIDATOR_DATE()]}
            errorText="Please enter a valid transfer date."
            onInput={inputHandler}
            initialValue={loadedTransfers.transferDate}
            initialValid={true}
          />
          <Input
            id="season"
            element="input"
            type="text"
            label="Season"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid season."
            onInput={inputHandler}
            initialValue={loadedTransfers.season}
            initialValid={true}
          />
          <Input
            id="compensationAmount"
            element="input"
            type="number"
            label="Compensation amount"
            validators={[VALIDATOR_NUMBER()]}
            errorText="Please enter a valid compensation amount."
            onInput={inputHandler}
            initialValue={loadedTransfers.compensationAmount}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update transfer
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateTransfer;
