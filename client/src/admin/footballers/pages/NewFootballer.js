import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../../shared/components//FormElements/Input";
import Button from "../../../shared/components/FormElements/Button";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_DATE,
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
// import "./FootballerForm.css";

const NewFootballer = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
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
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  let history = useHistory();

  const footballerSubmitHandler = async (event) => {
    event.preventDefault();

    if (auth.role !== "admin") {
      console.log("You do not have permission to perform this action.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("surname", formState.inputs.surname.value);
      formData.append("nationality", formState.inputs.nationality.value);
      formData.append("birthDate", formState.inputs.birthDate.value);
      formData.append("position", formState.inputs.position.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        "http://localhost:5001/api/admins/footballers/new",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/admins/footballers");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form onSubmit={footballerSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
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
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="PLease provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          Add footballer
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewFootballer;
