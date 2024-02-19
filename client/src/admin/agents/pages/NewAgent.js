import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

import Input from "../../../shared/components//FormElements/Input";
import Button from "../../../shared/components/FormElements/Button";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
// import "./FootballerForm.css";

const NewAgent = () => {
  const navigate = useNavigate();
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
      country: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      phoneNumber: {
        value: "",
        isValid: false,
      },
      description: {
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

  const agentSubmitHandler = async (event) => {
    event.preventDefault();

    if (auth.role !== "admin") {
      console.log("You do not have permission to perform this action.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("surname", formState.inputs.surname.value);
      formData.append("country", formState.inputs.country.value);
      formData.append("email", formState.inputs.email.value);
      formData.append("phoneNumber", formState.inputs.phoneNumber.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        "http://localhost:5001/api/admins/agents/new",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/agents");
      message.success("Agent successfully added!");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form onSubmit={agentSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="name"
          element="input"
          type="text"
          label="Name"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(20)]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
        />
        <Input
          id="surname"
          element="input"
          type="text"
          label="Surname"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(20)]}
          errorText="Please enter a valid surname."
          onInput={inputHandler}
        />
        <Input
          id="country"
          element="input"
          type="text"
          label="Country"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(20)]}
          errorText="Please enter a valid country."
          onInput={inputHandler}
        />
        <Input
          id="email"
          element="input"
          type="text"
          label="E-mail"
          validators={[
            VALIDATOR_REQUIRE(),
            VALIDATOR_EMAIL(),
            VALIDATOR_MAXLENGTH(20),
          ]}
          errorText="Please enter a valid email."
          onInput={inputHandler}
        />
        <Input
          id="phoneNumber"
          element="input"
          type="text"
          label="Phone number"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(20)]}
          errorText="Please enter a valid phone number."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description."
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="PLease provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          Add Agent
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewAgent;
