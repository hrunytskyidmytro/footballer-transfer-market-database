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
  VALIDATOR_NUMBER,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
// import "./FootballerForm.css";

const NewClub = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      country: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      cost: {
        value: "",
        isValid: false,
      },
      foundationYear: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const clubSubmitHandler = async (event) => {
    event.preventDefault();

    if (auth.role !== "admin") {
      console.log("You do not have permission to perform this action.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("country", formState.inputs.country.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("cost", formState.inputs.cost.value);
      formData.append("foundationYear", formState.inputs.foundationYear.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        "http://localhost:5001/api/admins/clubs/new",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/clubs");
      message.success("Club successfully added!");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form onSubmit={clubSubmitHandler}>
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
          id="country"
          element="input"
          type="text"
          label="Country"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(20)]}
          errorText="Please enter a valid country."
          onInput={inputHandler}
        />
        <Input
          id="cost"
          element="input"
          type="number"
          label="Cost"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
          errorText="Please enter a valid cost."
          onInput={inputHandler}
        />
        <Input
          id="foundationYear"
          element="input"
          type="number"
          label="Foundation year"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
          errorText="Please enter a valid foundation year."
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
          Add Club
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewClub;
