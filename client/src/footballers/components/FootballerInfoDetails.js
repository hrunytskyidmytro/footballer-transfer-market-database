import React from "react";
import { Link } from "react-router-dom";
import { Descriptions, Image, Rate, Row, Col, List, Empty } from "antd";
import moment from "moment";

import TransferItem from "../components/TransferItem";
import RatingForm from "../components/RatingForm";

const FootballerInfoDetails = ({
  footballer,
  token,
  averageRating,
  transfers,
  isLoading,
}) => {
  return (
    <Row justify="center">
      <Col span={24}>
        <Descriptions
          title={`${footballer.name} ${footballer.surname}`}
          bordered
          column={2}
          layout="vertical"
        >
          <Descriptions.Item label="Nationality">
            {footballer.nationality}
          </Descriptions.Item>
          <Descriptions.Item label="Date of birth">
            {moment(footballer.birthDate).format("MMMM Do YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Weight">
            {footballer.weight} kg
          </Descriptions.Item>
          <Descriptions.Item label="Height">
            {(footballer.height / 100).toFixed(2)} m
          </Descriptions.Item>
          <Descriptions.Item label="Age">
            {footballer.age} years
          </Descriptions.Item>
          <Descriptions.Item label="Foot">{footballer.foot}</Descriptions.Item>
          <Descriptions.Item label="Agent">
            {footballer.agent ? (
              <Link to={`/agents/${footballer.agent.id}`}>
                {`${footballer.agent.name} ${footballer.agent.surname}`}
              </Link>
            ) : (
              "Not found"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Club">
            {footballer.club ? (
              <Link to={`/clubs/${footballer.club.id}`}>
                <Image
                  src={`http://localhost:5001/${footballer.club.image}`}
                  alt={`${footballer.club.name}`}
                  preview={false}
                  style={{ maxWidth: "25px" }}
                />{" "}
                {footballer.club.name}
              </Link>
            ) : (
              "Not found"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Contract until">
            {moment(footballer.contractUntil).format("MMMM Do YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Place of birth">
            {footballer.placeOfBirth}
          </Descriptions.Item>
          <Descriptions.Item label="Main position">
            {footballer.mainPosition}
          </Descriptions.Item>
          <Descriptions.Item label="Additional position">
            {footballer.additionalPosition}
          </Descriptions.Item>
          <Descriptions.Item label="Cost">
            {footballer.cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} €
          </Descriptions.Item>
          <Descriptions.Item label="Rating">
            <Rate
              allowHalf
              disabled
              defaultValue={averageRating !== null ? averageRating : 0}
            />
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Col
        span={12}
        style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}
      >
        {token && <RatingForm footballerId={footballer.id} />}
      </Col>
      <Col span={24}>
        <Descriptions bordered column={2} layout="vertical">
          <Descriptions.Item label="Transfers" span={2}>
            {transfers && transfers.length > 0 ? (
              <List
                loading={isLoading}
                itemLayout="horizontal"
                dataSource={transfers}
                renderItem={(transfer) => <TransferItem transfer={transfer} />}
              />
            ) : (
              <Empty description="No transfers found." />
            )}
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </Row>
  );
};

export default FootballerInfoDetails;
