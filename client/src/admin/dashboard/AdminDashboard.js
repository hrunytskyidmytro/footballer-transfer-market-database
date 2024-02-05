import React from "react";
import { FaUser } from "react-icons/fa";
import { FaPersonRunning } from "react-icons/fa6";
import { MdTransferWithinAStation } from "react-icons/md";
import { LiaFutbolSolid } from "react-icons/lia";

import { NavLink } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <Card className="admin-dashboard">
      <FaUser /> <NavLink to="admins/users">Users</NavLink>
      <hr />
      <FaPersonRunning />
      <NavLink to="admins/footballers">Footballers</NavLink>
      <hr />
      <MdTransferWithinAStation />
      <NavLink to="admins/transfers">Transfers</NavLink>
      <hr />
      <LiaFutbolSolid />
      <NavLink to="admins/clubs">Clubs</NavLink>
    </Card>
  );
};

export default AdminDashboard;
