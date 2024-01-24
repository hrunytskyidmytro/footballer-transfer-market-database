import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_DATE,
} from "../../shared/util/validators";

import { useForm } from "../../shared/hooks/form-hook";
import "./FootballerForm.css";

const ARR_FOOTBALLERS = [
  {
    id: "f1",
    name: "Lionel",
    surname: "Messi",
    nationality: "Arg",
    birthDate: "2024-01-23",
    position: "Attacker",
    image: "https://fcb-abj-pre.s3.amazonaws.com/img/jugadors/MESSI.jpg",
    clubs: "c1",
    transfers: "t1",
    creator: "u1",
  },
  {
    id: "f2",
    name: "Cristiano",
    surname: "Ronaldo",
    nationality: "Port",
    birthDate: "2024-01-23",
    position: "Attacker",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg/640px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg",
    clubs: "c1",
    transfers: "t1",
    creator: "u2",
  },
];

const UpdateFootballer = () => {
  const [isLoading, setIsLoading] = useState(true);
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

  const identifiedFootballer = ARR_FOOTBALLERS.find(
    (f) => f.id === footballerId
  );

  useEffect(() => {
    if (identifiedFootballer) {
      setFormData(
        {
          name: {
            value: identifiedFootballer.name,
            isValid: true,
          },
          surname: {
            value: identifiedFootballer.surname,
            isValid: true,
          },
          nationality: {
            value: identifiedFootballer.nationality,
            isValid: true,
          },
          birthDate: {
            value: identifiedFootballer.birthDate,
            isValid: true,
          },
          position: {
            value: identifiedFootballer.position,
            isValid: true,
          },
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, identifiedFootballer]);

  const footballerSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedFootballer) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find footballer!</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <form className="footballer-form" onSubmit={footballerSubmitHandler}>
      <Input
        id="name"
        element="input"
        type="text"
        label="Name"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid name."
        onInput={inputHandler}
        initialValue={formState.inputs.name.value}
        initialValid={formState.inputs.name.isValid}
      />
      <Input
        id="surname"
        element="input"
        type="text"
        label="Surname"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid surname."
        onInput={inputHandler}
        initialValue={formState.inputs.surname.value}
        initialValid={formState.inputs.surname.isValid}
      />
      <Input
        id="nationality"
        element="input"
        type="text"
        label="Nationality"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid nationality."
        onInput={inputHandler}
        initialValue={formState.inputs.nationality.value}
        initialValid={formState.inputs.nationality.isValid}
      />
      <Input
        id="birthDate"
        element="input"
        type="date"
        label="Date of birth"
        validators={[VALIDATOR_DATE()]}
        errorText="Please enter a valid date of birth."
        onInput={inputHandler}
        initialValue={formState.inputs.birthDate.value}
        initialValid={formState.inputs.birthDate.isValid}
      />
      <Input
        id="position"
        element="input"
        type="text"
        label="Position"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid position."
        onInput={inputHandler}
        initialValue={formState.inputs.position.value}
        initialValid={formState.inputs.position.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE FOOTBALLER
      </Button>
    </form>
  );
};

export default UpdateFootballer;
