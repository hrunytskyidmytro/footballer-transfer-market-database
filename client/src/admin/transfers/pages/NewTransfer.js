import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

import Input from "../../../shared/components//FormElements/Input";
import Button from "../../../shared/components/FormElements/Button";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_NUMBER,
  VALIDATOR_DATE,
  VALIDATOR_MAXLENGTH,
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
// import "./FootballerForm.css";

const NewTransfer = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [footballers, setFootballers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [formState, inputHandler, setFormData] = useForm(
    {
      transferFee: {
        value: 0,
        isValid: false,
      },
      transferDate: {
        value: "",
        isValid: false,
      },
      transferType: {
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

  const transferSubmitHandler = async (event) => {
    event.preventDefault();

    if (auth.role !== "admin") {
      console.log("You do not have permission to perform this action.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("footballer", formState.inputs.footballer.value);
      formData.append("fromClub", formState.inputs.fromClub.value);
      formData.append("toClub", formState.inputs.toClub.value);
      formData.append("transferFee", formState.inputs.transferFee.value);
      formData.append("transferDate", formState.inputs.transferDate.value);
      formData.append("transferType", formState.inputs.transferType.value);
      formData.append("season", formState.inputs.season.value);
      formData.append(
        "compensationAmount",
        formState.inputs.compensationAmount.value
      );
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

  const selectHandler = (event) => {
    const id = event.target.id;
    const value = event.target.value;
    const isValid = !!value;

    setFormData({
      ...formState.inputs,
      [id]: { value: value, isValid: isValid },
    });
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form onSubmit={transferSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <select id="footballer" onChange={selectHandler}>
          <option value="">Choose footballer</option>
          {footballers.map((footballer) => (
            <option key={footballer.id} value={footballer.id}>
              {footballer.name} {footballer.surname}
            </option>
          ))}
        </select>
        <select id="fromClub" onChange={selectHandler}>
          <option value="">Choose from club</option>
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </select>
        <select id="toClub" onChange={selectHandler}>
          <option value="">Choose to club</option>
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </select>
        <Input
          id="transferFee"
          element="input"
          type="number"
          label="Transfer Fee"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
          errorText="Please enter a valid transfer fee."
          onInput={inputHandler}
        />
        <Input
          id="transferDate"
          element="input"
          type="date"
          label="Transfer date"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_DATE()]}
          errorText="Please enter a valid transfer date."
          onInput={inputHandler}
        />
        <Input
          id="transferType"
          element="input"
          type="text"
          label="Transfer type"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(10)]}
          errorText="Please enter a valid transfer type."
          onInput={inputHandler}
        />
        <Input
          id="season"
          element="input"
          type="text"
          label="Season"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(10)]}
          errorText="Please enter a valid season."
          onInput={inputHandler}
        />
        <Input
          id="compensationAmount"
          element="input"
          type="number"
          label="Compensation Amount"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
          errorText="Please enter a valid compensation amount."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          Add Transfer
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewTransfer;
