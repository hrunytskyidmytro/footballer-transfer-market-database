import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin } from "antd";
import moment from "moment";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const FootballerInfo = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedFootballer, setLoadedFootballer] = useState();
  const { footballerId } = useParams();

  useEffect(() => {
    const fetchFootballer = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/footballers/${footballerId}`
        );

        setLoadedFootballer(responseData.footballer);
      } catch (err) {}
    };
    fetchFootballer();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <Spin size="large" />
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {loadedFootballer && (
          <Card
            key={loadedFootballer.id}
            hoverable
            style={{ width: 200, margin: 20 }}
            cover={
              <img
                alt={`${loadedFootballer.name} ${loadedFootballer.surname}`}
                src={`http://localhost:5001/${loadedFootballer.image}`}
              />
            }
          >
            <Card.Meta
              title={`${loadedFootballer.name} ${loadedFootballer.surname}`}
              description={`Nationality: ${loadedFootballer.nationality}`}
            />
            <p>
              Date of birth:{" "}
              {moment(loadedFootballer.birthDate).format("MMMM Do YYYY")}
            </p>
            <p>Weight: {loadedFootballer.weight} kg</p>
            <p>Height: {(loadedFootballer.height / 100).toFixed(2)} m</p>
            <p>Age: {loadedFootballer.age} years</p>
            <p>Foot: {loadedFootballer.foot}</p>
            <p>
              Agent:{" "}
              {loadedFootballer.agent
                ? `${loadedFootballer.agent.name} ${loadedFootballer.agent.surname}`
                : "Not found"}
            </p>
            <p>
              Club:{" "}
              {loadedFootballer.club ? loadedFootballer.club.name : "Not found"}
            </p>
            <p>
              Contract until:{" "}
              {moment(loadedFootballer.contractUntil).format("MMMM Do YYYY")}
            </p>
            <p>Place of birth: {loadedFootballer.placeOfBirth}</p>
            <p>Main position: {loadedFootballer.mainPosition}</p>
            <p>Additional position: {loadedFootballer.additionalPosition}</p>
            <p>Cost: €{loadedFootballer.cost}</p>
          </Card>
        )}
      </div>
    </React.Fragment>
  );
};

export default FootballerInfo;
