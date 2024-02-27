import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { Card } from "antd";
// import moment from "moment";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
// import { AuthContext } from "../../shared/context/auth-context";

const Footballers = () => {
  //   const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedFootballers, setLoadedFootballers] = useState();

  useEffect(() => {
    const fetchFootballers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/footballers/"
        );

        setLoadedFootballers(responseData.footballers);
      } catch (err) {}
    };
    fetchFootballers();
  }, [sendRequest]);

  const handleCardClick = (footballerId) => {
    // Handle card click here
    console.log("Clicked on footballer with ID:", footballerId);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {!isLoading &&
          loadedFootballers &&
          loadedFootballers.map((footballer) => (
            <Card
              key={footballer.id}
              hoverable
              style={{ width: 200, margin: 20 }}
              cover={
                <img
                  alt={`${footballer.name} ${footballer.surname}`}
                  src={`http://localhost:5001/${footballer.image}`}
                />
              }
              onClick={() => handleCardClick(footballer.id)}
            >
              <Card.Meta
                title={`${footballer.name} ${footballer.surname}`}
                description={`Nationality: ${footballer.nationality}`}
              />
              {/* <p>
                Date of birth:{" "}
                {moment(footballer.birthDate).format("MMMM Do YYYY")}
              </p>
              <p>Weight: {footballer.weight} kg</p>
              <p>Height: {(footballer.height / 100).toFixed(2)} m</p>
              <p>Age: {footballer.age} years</p>
              <p>Foot: {footballer.foot}</p>
              <p>
                Agent:{" "}
                {footballer.agent ? footballer.agent.surname : "Not found"}
              </p>
              <p>
                Club: {footballer.club ? footballer.club.name : "Not found"}
              </p>
              <p>
                Contract until:{" "}
                {moment(footballer.contractUntil).format("MMMM Do YYYY")}
              </p>
              <p>Place of birth: {footballer.placeOfBirth}</p>
              <p>Main position: {footballer.mainPosition}</p>
              <p>Additional position: {footballer.additionalPosition}</p>
              <p>Cost: €{footballer.cost}</p> */}
            </Card>
          ))}
      </div>
    </React.Fragment>
  );
};

export default Footballers;
