import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import Footballers from "../footballers/pages/Footballers";
import Clubs from "../clubs/pages/Clubs";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/footballers/" element={<Outlet />}>
        <Route index element={<Footballers />} />
        {/* <Route path=":userId" element={<UpdateUser />} /> */}
      </Route>
      <Route path="/clubs/" element={<Outlet />}>
        <Route index element={<Clubs />} />
        {/* <Route path=":userId" element={<UpdateUser />} /> */}
      </Route>
    </Routes>
  );
};

export default UserRoutes;
