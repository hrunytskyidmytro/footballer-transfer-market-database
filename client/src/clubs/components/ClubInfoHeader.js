import React from "react";
import { Image } from "antd";

const ClubInfoHeader = ({ clubImage, clubName }) => {
  return (
    <div
      style={{
        width: "40%",
        marginTop: "5%",
      }}
    >
      <Image src={clubImage} alt={clubName} style={{ maxWidth: "100%" }} />
    </div>
  );
};

export default ClubInfoHeader;
