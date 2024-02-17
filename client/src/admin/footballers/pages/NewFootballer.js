import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

import Input from "../../../shared/components//FormElements/Input";
import Button from "../../../shared/components/FormElements/Button";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_DATE,
  VALIDATOR_NUMBER,
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
// import "./FootballerForm.css";

const NewFootballer = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [agents, setAgents] = useState([]);
  const [clubs, setClubs] = useState([]);
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
    const fetchAgentsAndClubs = async () => {
      try {
        const agentsResponse = await sendRequest(
          "http://localhost:5001/api/admins/agents"
        );
        setAgents(agentsResponse.agents);

        const clubsResponse = await sendRequest(
          "http://localhost:5001/api/admins/clubs"
        );
        setClubs(clubsResponse.clubs);
      } catch (err) {}
    };
    fetchAgentsAndClubs();
  }, [sendRequest]);

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
      formData.append("weight", formState.inputs.weight.value);
      formData.append("height", formState.inputs.height.value);
      formData.append("age", formState.inputs.age.value);
      formData.append("foot", formState.inputs.foot.value);
      formData.append("contractUntil", formState.inputs.contractUntil.value);
      formData.append("placeOfBirth", formState.inputs.placeOfBirth.value);
      formData.append("mainPosition", formState.inputs.mainPosition.value);
      formData.append(
        "additionalPosition",
        formState.inputs.additionalPosition.value
      );
      formData.append("cost", formState.inputs.cost.value);
      formData.append("agent", formState.inputs.agent.value);
      formData.append("club", formState.inputs.club.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        "http://localhost:5001/api/admins/footballers/new",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/footballers");
      message.success("Footballer successfully added!");
    } catch (err) {}
  };

  const selectHandler = (event) => {
    const id = event.target.id;
    const value = event.target.value;
    const isValid = !!value;

    setFormData({
      ...formState.inputs,
      [id]: { value: value, isValid: isValid },
    });
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form onSubmit={footballerSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <select id="agent" onChange={selectHandler}>
          <option value="">Choose agent</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name} {agent.surname}
            </option>
          ))}
        </select>
        <select id="club" onChange={selectHandler}>
          <option value="">Choose club</option>
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </select>
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
          id="weight"
          element="input"
          type="number"
          label="Weight"
          validators={[VALIDATOR_NUMBER()]}
          errorText="Please enter a valid weight."
          onInput={inputHandler}
        />
        <Input
          id="height"
          element="input"
          type="number"
          label="Height"
          validators={[VALIDATOR_NUMBER()]}
          errorText="Please enter a valid height."
          onInput={inputHandler}
        />
        <Input
          id="age"
          element="input"
          type="number"
          label="Age"
          validators={[VALIDATOR_NUMBER()]}
          errorText="Please enter a valid age."
          onInput={inputHandler}
        />
        <Input
          id="foot"
          element="input"
          type="text"
          label="Foot"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid foot."
          onInput={inputHandler}
        />
        <Input
          id="contractUntil"
          element="input"
          type="date"
          label="Contract until"
          validators={[VALIDATOR_DATE()]}
          errorText="Please enter a valid contract."
          onInput={inputHandler}
        />
        <Input
          id="placeOfBirth"
          element="input"
          type="text"
          label="Place of birth"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid place."
          onInput={inputHandler}
        />
        <Input
          id="mainPosition"
          element="input"
          type="text"
          label="Main position"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid main position."
          onInput={inputHandler}
        />
        <Input
          id="additionalPosition"
          element="input"
          type="text"
          label="Additional position"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid additional position."
          onInput={inputHandler}
        />
        <Input
          id="cost"
          element="input"
          type="number"
          label="Cost"
          validators={[VALIDATOR_NUMBER()]}
          errorText="Please enter a valid cost."
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="PLease provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          Add Footballer
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewFootballer;
