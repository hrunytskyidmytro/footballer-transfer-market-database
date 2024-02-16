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

const UpdateFootballer = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedFootballers, setLoadedFootballers] = useState();
  const { footballerId } = useParams();

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
      weight: {
        value: "",
        isValid: false,
      },
      height: {
        value: "",
        isValid: false,
      },
      age: {
        value: "",
        isValid: false,
      },
      foot: {
        value: "",
        isValid: false,
      },
      contractUntil: {
        value: "",
        isValid: false,
      },
      placeOfBirth: {
        value: "",
        isValid: false,
      },
      mainPosition: {
        value: "",
        isValid: false,
      },
      additionalPosition: {
        value: "",
        isValid: false,
      },
      cost: {
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
            weight: {
              value: responseData.footballer.weight,
              isValid: true,
            },
            height: {
              value: responseData.footballer.height,
              isValid: true,
            },
            age: {
              value: responseData.footballer.age,
              isValid: true,
            },
            foot: {
              value: responseData.footballer.foot,
              isValid: true,
            },
            contractUntil: {
              value: responseData.footballer.contractUntil,
              isValid: true,
            },
            placeOfBirth: {
              value: responseData.footballer.placeOfBirth,
              isValid: true,
            },
            mainPosition: {
              value: responseData.footballer.mainPosition,
              isValid: true,
            },
            additionalPosition: {
              value: responseData.footballer.additionalPosition,
              isValid: true,
            },
            cost: {
              value: responseData.footballer.cost,
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
          weight: formState.inputs.weight.value,
          height: formState.inputs.height.value,
          age: formState.inputs.age.value,
          foot: formState.inputs.foot.value,
          contractUntil: formState.inputs.contractUntil.value,
          placeOfBirth: formState.inputs.placeOfBirth.value,
          mainPosition: formState.inputs.mainPosition.value,
          additionalPosition: formState.inputs.additionalPosition.value,
          cost: formState.inputs.cost.value,
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
      {!isLoading && loadedFootballers && (
        <form className="footballer-form" onSubmit={footballerSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={loadedFootballers.name}
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
            initialValue={loadedFootballers.surname}
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
            initialValue={loadedFootballers.nationality}
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
            initialValue={loadedFootballers.birthDate}
            initialValid={true}
          />
          <Input
            id="weight"
            element="input"
            type="number"
            label="Weight"
            validators={[VALIDATOR_NUMBER()]}
            errorText="Please enter a valid weight."
            onInput={inputHandler}
            initialValue={loadedFootballers.weight}
            initialValid={true}
          />
          <Input
            id="height"
            element="input"
            type="number"
            label="Height"
            validators={[VALIDATOR_NUMBER()]}
            errorText="Please enter a valid height."
            onInput={inputHandler}
            initialValue={loadedFootballers.height}
            initialValid={true}
          />
          <Input
            id="age"
            element="input"
            type="number"
            label="Age"
            validators={[VALIDATOR_NUMBER()]}
            errorText="Please enter a valid age."
            onInput={inputHandler}
            initialValue={loadedFootballers.age}
            initialValid={true}
          />
          <Input
            id="foot"
            element="input"
            type="text"
            label="Foot"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid foot."
            onInput={inputHandler}
            initialValue={loadedFootballers.foot}
            initialValid={true}
          />
          <Input
            id="contractUntil"
            element="input"
            type="date"
            label="Contract until"
            validators={[VALIDATOR_DATE()]}
            errorText="Please enter a valid contract."
            onInput={inputHandler}
            initialValue={loadedFootballers.contractUntil}
            initialValid={true}
          />
          <Input
            id="placeOfBirth"
            element="input"
            type="text"
            label="Place of birth"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid place."
            onInput={inputHandler}
            initialValue={loadedFootballers.placeOfBirth}
            initialValid={true}
          />
          <Input
            id="mainPosition"
            element="input"
            type="text"
            label="Main position"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid main position."
            onInput={inputHandler}
            initialValue={loadedFootballers.mainPosition}
            initialValid={true}
          />
          <Input
            id="additionalPosition"
            element="input"
            type="text"
            label="Additional position"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid additional position."
            onInput={inputHandler}
            initialValue={loadedFootballers.additionalPosition}
            initialValid={true}
          />
          <Input
            id="cost"
            element="input"
            type="number"
            label="Cost"
            validators={[VALIDATOR_NUMBER()]}
            errorText="Please enter a valid cost."
            onInput={inputHandler}
            initialValue={loadedFootballers.cost}
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
