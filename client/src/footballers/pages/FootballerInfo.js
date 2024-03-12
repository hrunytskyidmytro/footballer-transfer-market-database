import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";

import FootballerInfoHeader from "../components/FootballerInfoHeader";
import FootballerInfoDetails from "../components/FootballerInfoDetails";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const FootballerInfo = () => {
  const { token } = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedFootballer, setLoadedFootballer] = useState();
  const [transfers, setTransfers] = useState();
  const [averageRating, setAverageRating] = useState(null);
  const { footballerId } = useParams();

  useEffect(() => {
    const fetchFootballer = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/footballers/${footballerId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }
        );

        setLoadedFootballer(responseData.footballer);
      } catch (err) {}
    };
    fetchFootballer();
  }, [sendRequest]);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/ratings/${footballerId}/average`,
          "GET",
          null,
          {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }
        );

        setAverageRating(responseData.averageRating);
      } catch (err) {}
    };

    fetchAverageRating();
  }, [sendRequest, footballerId, token]);

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/transfers/footballer/${footballerId}`
        );
        setTransfers(responseData.transfers);
      } catch (err) {}
    };
    fetchTransfers();
  }, [sendRequest, footballerId]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <Spin size="large" />
        </div>
      )}
      {loadedFootballer && (
        <>
          <FootballerInfoHeader
            image={`http://localhost:5001/${loadedFootballer.image}`}
            name={`${loadedFootballer.name} ${loadedFootballer.surname}`}
          />
          <br />
          <FootballerInfoDetails
            footballer={loadedFootballer}
            token={token}
            averageRating={averageRating}
            transfers={transfers}
            isLoading={isLoading}
          />
        </>
      )}
    </>
  );
};

export default FootballerInfo;
