import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import FootballlersList from "../components/FootballersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserFootballers = () => {
  const [loadedFootballers, setLoadedFootballers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchFootballers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/footballers/user/${userId}`
        );
        setLoadedFootballers(responseData.footballers);
      } catch (err) {}
    };
    fetchFootballers();
  }, [sendRequest]);

  const footballerDeletedHandler = (deletedFootballerId) => {
    setLoadedFootballers((prevFootballers) =>
      prevFootballers.filter(
        (footballer) => footballer.id !== deletedFootballerId
      )
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedFootballers && (
        <FootballlersList
          items={loadedFootballers}
          onDeleteFootballer={footballerDeletedHandler}
        />
      )}
    </React.Fragment>
  );
};

export default UserFootballers;
