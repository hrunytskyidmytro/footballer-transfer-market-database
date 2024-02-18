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
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_NUMBER,
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
// import "./FootballerForm.css";

const UpdateClub = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedClubs, setLoadedClubs] = useState();
  const { clubId } = useParams();

  const [formState, inputHandler, setFormData] = useForm(
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

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/clubs/${clubId}`
        );
        setLoadedClubs(responseData.club);
        setFormData(
          {
            name: {
              value: responseData.club.name,
              isValid: true,
            },
            country: {
              value: responseData.club.country,
              isValid: true,
            },
            description: {
              value: responseData.club.description,
              isValid: true,
            },
            cost: {
              value: responseData.club.cost,
              isValid: true,
            },
            foundationYear: {
              value: responseData.club.foundationYear,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };

    fetchClub();
  }, [sendRequest, clubId, setFormData]);

  const clubSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/clubs/${clubId}`,
        "PATCH",
        JSON.stringify({
          name: formState.inputs.name.value,
          country: formState.inputs.country.value,
          description: formState.inputs.description.value,
          cost: formState.inputs.cost.value,
          foundationYear: formState.inputs.foundationYear.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/clubs");
      message.success("Club successfully edited!");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedClubs && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find club!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedClubs && (
        <form className="club-form" onSubmit={clubSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(20)]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={loadedClubs.name}
            initialValid={true}
          />
          <Input
            id="country"
            element="input"
            type="text"
            label="Country"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(20)]}
            errorText="Please enter a valid country."
            onInput={inputHandler}
            initialValue={loadedClubs.country}
            initialValid={true}
          />
          <Input
            id="cost"
            element="input"
            type="text"
            label="Cost"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
            errorText="Please enter a valid cost."
            onInput={inputHandler}
            initialValue={loadedClubs.cost}
            initialValid={true}
          />
          <Input
            id="foundationYear"
            element="input"
            type="number"
            label="Foundation year"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
            errorText="Please enter a valid foundation year."
            onInput={inputHandler}
            initialValue={loadedClubs.foundationYear}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description."
            onInput={inputHandler}
            initialValue={loadedClubs.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update Club
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateClub;
