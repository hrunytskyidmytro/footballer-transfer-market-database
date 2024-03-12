import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";

import ClubInfoHeader from "../components/ClubInfoHeader";
import ClubInfoDetails from "../components/ClubInfoDetails";

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
  }, [sendRequest, clubId]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <Spin size="large" />
        </div>
      )}
      {loadedClub && (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ClubInfoHeader
              clubImage={
                loadedClub && `http://localhost:5001/${loadedClub.image}`
              }
              clubName={loadedClub && loadedClub.name}
            />
            {loadedClub && <ClubInfoDetails club={loadedClub} />}
          </div>
        </>
      )}
    </>
  );
};

export default ClubInfo;
