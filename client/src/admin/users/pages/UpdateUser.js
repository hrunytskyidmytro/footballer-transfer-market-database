import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";

import Input from "../../../shared/components/FormElements/Input";
import Button from "../../../shared/components/FormElements/Button";
import Card from "../../../shared/components/UIElements/Card";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
// import "./FootballerForm.css";

const UpdateUser = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const userId = useParams().userId;

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
      email: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/users/${userId}`
        );
        setLoadedUsers(responseData.user);
        setFormData(
          {
            name: {
              value: responseData.user.name,
              isValid: true,
            },
            surname: {
              value: responseData.user.surname,
              isValid: true,
            },
            email: {
              value: responseData.user.email,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };

    fetchUser();
  }, [sendRequest, userId, setFormData]);

  const userSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/users/${userId}`,
        "PATCH",
        JSON.stringify({
          name: formState.inputs.name.value,
          surname: formState.inputs.surname.value,
          email: formState.inputs.email.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/users");
      message.success("User successfully edited!");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedUsers && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find user!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedUsers && (
        <form className="user-form" onSubmit={userSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(20)]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={loadedUsers.name}
            initialValid={true}
          />
          <Input
            id="surname"
            element="input"
            type="text"
            label="Surname"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(20)]}
            errorText="Please enter a valid surname."
            onInput={inputHandler}
            initialValue={loadedUsers.surname}
            initialValid={true}
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
            initialValue={loadedUsers.email}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update User
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateUser;
