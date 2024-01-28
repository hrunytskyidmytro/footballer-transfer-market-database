import React from "react";
import { FaUser } from "react-icons/fa";
import { FaPersonRunning } from "react-icons/fa6";
import { MdTransferWithinAStation } from "react-icons/md";
import { LiaFutbolSolid } from "react-icons/lia";

import { Link } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <Card className="admin-dashboard">
      <FaUser /> <Link to="/users">Users</Link>
      <hr />
      <FaPersonRunning />
      <Link to="/footballers">Footballers</Link>
      <hr />
      <MdTransferWithinAStation />
      <Link to="/transfers">Transfers</Link>
      <hr />
      <LiaFutbolSolid />
      <Link to="/clubs">Clubs</Link>
    </Card>
  );
};

export default AdminDashboard;
