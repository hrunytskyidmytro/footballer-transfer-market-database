import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import "./FootballerItem.css";

const FootballlerItem = (props) => {
  return (
    <li className="footballer-item">
      <Card className="footballer-item__content">
        <div className="footballer-item__image">
          <img src={props.image} alt={props.name} />
        </div>
        <div className="footballer-item__info">
          <h2>{props.name}</h2>
          <h2>{props.surname}</h2>
          <h3>{props.nationality}</h3>
          <h3>{props.birthDate}</h3>
          <h3>{props.position}</h3>
        </div>
        <div className="footballer-item__actions">
          <Button inverse>MORE INFORMATION</Button>
          <Button to={`/footballers/${props.id}`}>EDIT</Button>
          <Button danger>DELETE</Button>
        </div>
      </Card>
    </li>
  );
};

export default FootballlerItem;
