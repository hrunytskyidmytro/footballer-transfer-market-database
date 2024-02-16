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
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
// import "./FootballerForm.css";

const UpdateAgent = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedAgents, setLoadedAgents] = useState();
  const { agentId } = useParams();

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
    },
    false
  );

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/agents/${agentId}`
        );
        setLoadedAgents(responseData.agent);
        setFormData(
          {
            name: {
              value: responseData.agent.name,
              isValid: true,
            },
            surname: {
              value: responseData.agent.surname,
              isValid: true,
            },
            country: {
              value: responseData.agent.country,
              isValid: true,
            },
            email: {
              value: responseData.agent.email,
              isValid: true,
            },
            phoneNumber: {
              value: responseData.agent.phoneNumber,
              isValid: true,
            },
            description: {
              value: responseData.agent.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };

    fetchAgent();
  }, [sendRequest, agentId, setFormData]);

  const footballerSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/agents/${agentId}`,
        "PATCH",
        JSON.stringify({
          name: formState.inputs.name.value,
          surname: formState.inputs.surname.value,
          country: formState.inputs.country.value,
          email: formState.inputs.email.value,
          phoneNumber: formState.inputs.phoneNumber.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/agents");
      message.success("Agent successfully edited!");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedAgents && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find agent!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedAgents && (
        <form className="agent-form" onSubmit={footballerSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={loadedAgents.name}
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
            initialValue={loadedAgents.surname}
            initialValid={true}
          />
          <Input
            id="country"
            element="input"
            type="text"
            label="Country"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid country."
            onInput={inputHandler}
            initialValue={loadedAgents.country}
            initialValid={true}
          />
          <Input
            id="email"
            element="input"
            type="text"
            label="E-mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
            onInput={inputHandler}
            initialValue={loadedAgents.email}
            initialValid={true}
          />
          <Input
            id="phoneNumber"
            element="input"
            type="text"
            label="Phone number"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid phone number."
            onInput={inputHandler}
            initialValue={loadedAgents.phoneNumber}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description."
            onInput={inputHandler}
            initialValue={loadedAgents.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update Agent
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateAgent;
