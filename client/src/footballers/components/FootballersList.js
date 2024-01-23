import React from "react";

import Card from "../../shared/components/UIElements/Card";
import FootballlerItem from "./FootballerItem";
import "./FootballersList.css";

const FootballlersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="footballers-list center">
        <Card>
          <h2>No footballers found. Maybe create one?</h2>
          <button>Share Footballer</button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="footballers-list">
      {props.items.map((footballer) => (
        <FootballlerItem
          key={footballer.id}
          id={footballer.id}
          image={footballer.image}
          name={footballer.name}
          surname={footballer.surname}
          nationality={footballer.nationality}
          birthDate={footballer.birthDate}
          position={footballer.position}
          creatorId={footballer.creator}
          clubs={footballer.clubs}
          transfers={footballer.transfers}
        />
      ))}
    </ul>
  );
};

export default FootballlersList;