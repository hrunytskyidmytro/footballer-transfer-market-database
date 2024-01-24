import React from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_DATE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./FootballerForm.css";

const NewFootballer = () => {
  const [formState, inputHandler] = useForm(
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

  const footballerSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

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
      />
      <Input
        id="surname"
        element="input"
        type="text"
        label="Surname"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid surname."
        onInput={inputHandler}
      />
      <Input
        id="nationality"
        element="input"
        type="text"
        label="Nationality"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid nationality."
        onInput={inputHandler}
      />
      <Input
        id="birthDate"
        element="input"
        type="date"
        label="Date of birth"
        validators={[VALIDATOR_DATE()]}
        errorText="Please enter a valid date of birth."
        onInput={inputHandler}
      />
      <Input
        id="position"
        element="input"
        type="text"
        label="Position"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid position."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD FOOTBALLER
      </Button>
    </form>
  );
};

export default NewFootballer;
