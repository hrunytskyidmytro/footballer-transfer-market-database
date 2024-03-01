import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Spin } from "antd";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Clubs = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedClubs, setLoadedClubs] = useState();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/clubs/"
        );
        setLoadedClubs(responseData.clubs);
      } catch (err) {}
    };
    fetchClubs();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <Card>
          {!isLoading &&
            loadedClubs &&
            loadedClubs.map((club) => (
              <Card.Grid
                key={club.id}
                hoverable={true}
                style={{ width: "25%", textAlign: "center" }}
              >
                <Link to={`/clubs/${club.id}`} key={club.id}>
                  <img
                    alt={club.name}
                    src={`http://localhost:5001/${club.image}`}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "contain",
                    }}
                  />
                </Link>
              </Card.Grid>
            ))}
        </Card>
      )}
    </React.Fragment>
  );
};

export default Clubs;
