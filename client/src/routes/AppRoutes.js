import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Auth from "../user/pages/Auth";

import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";

import AdminLayout from "../layout/admin/AdminLayout";
import UserLayout from "../layout/user/UserLayout";

import { AuthContext } from "../shared/context/auth-context";

const AppRoutes = () => {
  const { token, role } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route path="*" element={<UserRoutes />} />
          {!token && <Route path="/auth" element={<Auth />} />}
        </Route>
        {(role === "admin" || role === "football_manager") && (
          <Route path="/admins/*" element={<AdminLayout />}>
            <Route path="*" element={<AdminRoutes />} />
          </Route>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
