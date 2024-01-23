import React from "react";
import { useParams } from "react-router-dom";

import FootballlersList from "../components/FootballersList";

const ARR_FOOTBALLERS = [
  {
    id: "f1",
    name: "Lionel",
    surname: "Messi",
    nationality: "Arg",
    birthDate: "2024-01-23",
    position: "Attacker",
    image: "https://fcb-abj-pre.s3.amazonaws.com/img/jugadors/MESSI.jpg",
    clubs: "c1",
    transfers: "t1",
    creator: "u1",
  },
  {
    id: "f2",
    name: "Cristiano",
    surname: "Ronaldo",
    nationality: "Port",
    birthDate: "2024-01-23",
    position: "Attacker",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg/640px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg",
    clubs: "c1",
    transfers: "t1",
    creator: "u2",
  },
];

const UserFootballers = () => {
  const userId =  useParams().userId;
  const loadedFootballers = ARR_FOOTBALLERS.filter(footballer => footballer.creator === userId);

  return <FootballlersList items={loadedFootballers} />;
};

export default UserFootballers;
