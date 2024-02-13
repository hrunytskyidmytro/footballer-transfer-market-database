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
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
// import "./FootballerForm.css";

const UpdateFootballer = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedFootballer, setLoadedFootballers] = useState();
  const footballerId = useParams().footballerId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      surname: {
        value: "",
        isValid: false,
      },
      nationality: {
        value: "",
        isValid: false,
      },
      birthDate: {
        value: "",
        isValid: false,
      },
      position: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchFootballer = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/footballers/${footballerId}`
        );
        setLoadedFootballers(responseData.footballer);
        setFormData(
          {
            name: {
              value: responseData.footballer.name,
              isValid: true,
            },
            surname: {
              value: responseData.footballer.surname,
              isValid: true,
            },
            nationality: {
              value: responseData.footballer.nationality,
              isValid: true,
            },
            birthDate: {
              value: responseData.footballer.birthDate,
              isValid: true,
            },
            position: {
              value: responseData.footballer.position,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };

    fetchFootballer();
  }, [sendRequest, footballerId, setFormData]);

  const footballerSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/footballers/${footballerId}`,
        "PATCH",
        JSON.stringify({
          name: formState.inputs.name.value,
          surname: formState.inputs.surname.value,
          nationality: formState.inputs.nationality.value,
          birthDate: formState.inputs.birthDate.value,
          position: formState.inputs.position.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/footballers");
      message.success("Footballer successfully edited!");
      // updateFootballers();
      // hideForm();
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedFootballer && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find footballer!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedFootballer && (
        <form className="footballer-form" onSubmit={footballerSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={loadedFootballer.name}
            initialValid={true}
          />
          <Input
            id="surname"
            element="input"
            type="text"
            label="Surname"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid surname."
            onInput={inputHandler}
            initialValue={loadedFootballer.surname}
            initialValid={true}
          />
          <Input
            id="nationality"
            element="input"
            type="text"
            label="Nationality"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid nationality."
            onInput={inputHandler}
            initialValue={loadedFootballer.nationality}
            initialValid={true}
          />
          <Input
            id="birthDate"
            element="input"
            type="date"
            label="Date of birth"
            validators={[VALIDATOR_DATE()]}
            errorText="Please enter a valid date of birth."
            onInput={inputHandler}
            initialValue={loadedFootballer.birthDate}
            initialValid={true}
          />
          <Input
            id="position"
            element="input"
            type="text"
            label="Position"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid position."
            onInput={inputHandler}
            initialValue={loadedFootballer.position}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE FOOTBALLER
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateFootballer;
