import React from "react";
import { Link } from "react-router-dom";
import { Card } from "antd";

const FootballerCard = ({ footballer }) => {
  return (
    <Link to={`/footballers/${footballer.id}`}>
      <Card
        hoverable
        cover={
          <img
            alt={`${footballer.name} ${footballer.surname}`}
            src={`http://localhost:5001/${footballer.image}`}
          />
        }
        style={{ width: 400, margin: 20 }}
      >
        <Card.Meta
          title={`${footballer.name} ${footballer.surname}`}
          description={`Cost: ${footballer.cost
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} €`}
        />
      </Card>
    </Link>
  );
};

export default FootballerCard;
