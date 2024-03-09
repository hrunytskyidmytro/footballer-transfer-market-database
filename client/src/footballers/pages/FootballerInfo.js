import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Spin, Rate, Descriptions, Row, Col, Image, List, Empty } from "antd";
import moment from "moment";

import RatingForm from "../components/RatingForm";

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

  // const updateAverageRating = async () => {
  //   try {
  //     const responseData = await sendRequest(
  //       `http://localhost:5001/api/ratings/${footballerId}/average`,
  //       "GET",
  //       null,
  //       {
  //         Authorization: "Bearer " + token,
  //         "Content-Type": "application/json",
  //       }
  //     );

  //     setAverageRating(responseData.averageRating);
  //   } catch (err) {}
  // };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <Spin size="large" />
        </div>
      )}
      {loadedFootballer && (
        <>
          <Row justify="center">
            <Col span={24} style={{ textAlign: "center" }}>
              <Image
                src={`http://localhost:5001/${loadedFootballer.image}`}
                alt={`${loadedFootballer.name} ${loadedFootballer.surname}`}
                style={{ maxWidth: "200px", borderRadius: 20 }}
              />
            </Col>
          </Row>
          <br />
          <br />
          <Row justify="center">
            <Col span={24}>
              <Descriptions
                title={`${loadedFootballer.name} ${loadedFootballer.surname}`}
                bordered
                column={2}
                layout="vertical"
              >
                <Descriptions.Item label="Nationality">
                  {loadedFootballer.nationality}
                </Descriptions.Item>
                <Descriptions.Item label="Date of birth">
                  {moment(loadedFootballer.birthDate).format("MMMM Do YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Weight">
                  {loadedFootballer.weight} kg
                </Descriptions.Item>
                <Descriptions.Item label="Height">
                  {(loadedFootballer.height / 100).toFixed(2)} m
                </Descriptions.Item>
                <Descriptions.Item label="Age">
                  {loadedFootballer.age} years
                </Descriptions.Item>
                <Descriptions.Item label="Foot">
                  {loadedFootballer.foot}
                </Descriptions.Item>
                <Descriptions.Item label="Agent">
                  {loadedFootballer.agent ? (
                    <Link to={`/agents/${loadedFootballer.agent.id}`}>
                      {`${loadedFootballer.agent.name} ${loadedFootballer.agent.surname}`}
                    </Link>
                  ) : (
                    "Not found"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Club">
                  {loadedFootballer.club ? (
                    <Link to={`/clubs/${loadedFootballer.club.id}`}>
                      {loadedFootballer.club.name}
                    </Link>
                  ) : (
                    "Not found"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Contract until">
                  {moment(loadedFootballer.contractUntil).format(
                    "MMMM Do YYYY"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Place of birth">
                  {loadedFootballer.placeOfBirth}
                </Descriptions.Item>
                <Descriptions.Item label="Main position">
                  {loadedFootballer.mainPosition}
                </Descriptions.Item>
                <Descriptions.Item label="Additional position">
                  {loadedFootballer.additionalPosition}
                </Descriptions.Item>
                <Descriptions.Item label="Cost">
                  €{loadedFootballer.cost}
                </Descriptions.Item>
                <Descriptions.Item label="Rating">
                  <Rate
                    allowHalf
                    disabled
                    defaultValue={averageRating !== null ? averageRating : 0}
                  />
                </Descriptions.Item>
                {/* <Descriptions.Item label="Transfers">
                  {transfers && transfers.length > 0 ? (
                    <List
                      itemLayout="horizontal"
                      dataSource={transfers}
                      renderItem={(transfer) => (
                        <List.Item>
                          <List.Item.Meta
                            title={`${moment(transfer.date).format(
                              "MMMM Do YYYY"
                            )}`}
                            description={`From: ${transfer.fromClub.name} - To: ${transfer.toClub.name}`}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="No transfers found" />
                  )}
                </Descriptions.Item> */}
              </Descriptions>
            </Col>
          </Row>
          <Row justify="center">
            <Col span={12}>
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                {token && (
                  <RatingForm
                    footballerId={loadedFootballer.id}
                    // updateAverageRating={updateAverageRating}
                  />
                )}
              </div>
            </Col>
          </Row>
          <br />
          <br />
          <Row justify="center">
            <Col span={24}>
              <Descriptions bordered column={2} layout="vertical">
                <Descriptions.Item label="Transfers" span={2}>
                  {transfers && transfers.length > 0 ? (
                    <List
                      loading={isLoading}
                      itemLayout="horizontal"
                      dataSource={transfers}
                      renderItem={(transfer) => (
                        <List.Item>
                          <List.Item.Meta
                            title={`${moment(transfer.date).format(
                              "MMMM Do YYYY"
                            )}`}
                            description={`From: ${transfer.fromClub.name} - To: ${transfer.toClub.name}`}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="No transfers found" />
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </>
      )}
    </React.Fragment>
  );
};

export default FootballerInfo;
