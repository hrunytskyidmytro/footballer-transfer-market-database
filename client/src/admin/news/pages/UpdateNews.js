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
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
// import "./FootballerForm.css";

const UpdateNews = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedNews, setLoadedNews] = useState();
  const { newId } = useParams();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
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
    const fetchNews = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/admins/news/${newId}`
        );
        setLoadedNews(responseData.n);
        setFormData(
          {
            title: {
              value: responseData.n.title,
              isValid: true,
            },
            description: {
              value: responseData.n.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };

    fetchNews();
  }, [sendRequest, newId, setFormData]);

  const footballerSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5001/api/admins/news/${newId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/admins/news");
      message.success("News successfully edited!");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedNews && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find news!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedNews && (
        <form className="news-form" onSubmit={footballerSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(60)]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedNews.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description."
            onInput={inputHandler}
            initialValue={loadedNews.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update News
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateNews;
