import React, { useCallback } from "react";

import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import "./NewFootballer.css";

const NewFootballer = () => {
  const nameInputHandler = useCallback((id, value, isValid) => {}, []);
  const surnameInputHandler = useCallback((id, value, isValid) => {}, []);

  return (
    <form className="footballer-form">
      <Input
        id="name"
        element="input"
        type="text"
        label="Name"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid name."
        onInput={nameInputHandler}
      />
      <Input
        id="surname"
        element="input"
        type="text"
        label="Surname"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid surname."
        onInput={surnameInputHandler}
      />
      <Input element="input" type="text" label="Nationality" />
      <Input element="input" type="date" label="Date of birth" />
      <Input element="input" type="text" label="Position" />
    </form>
  );
};

export default NewFootballer;
