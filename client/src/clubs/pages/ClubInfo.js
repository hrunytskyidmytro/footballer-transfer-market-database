import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const ClubInfo = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedClub, setLoadedClub] = useState();
  const { clubId } = useParams();

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/clubs/${clubId}`
        );

        setLoadedClub(responseData.club);
      } catch (err) {}
    };
    fetchClub();
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
        {loadedClub && (
          <article>
            <img
              alt={loadedClub.name}
              src={`http://localhost:5001/${loadedClub.image}`}
            />
            <h2>{loadedClub.name}</h2>
            <p>Description: {loadedClub.description}</p>
            <p>Country: {loadedClub.country}</p>
            <p>Cost: {loadedClub.cost} kg</p>
            <p>Foundation year: {loadedClub.foudationYear} </p>
          </article>
        )}
      </div>
    </React.Fragment>
  );
};

export default ClubInfo;
