import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const { Meta } = Card;

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
      {isLoading && <LoadingSpinner />}
      <Row gutter={[24, 24]}>
        {!isLoading &&
          loadedClubs &&
          loadedClubs.map((club) => (
            <Col key={club.id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                style={{ width: "100%", height: "100%" }}
                cover={
                  <img
                    alt={club.name}
                    src={`http://localhost:5001/${club.image}`}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "contain",
                    }}
                  />
                }
              >
                <Meta title={club.name} />
              </Card>
            </Col>
          ))}
      </Row>
    </React.Fragment>
  );
};

export default Clubs;
