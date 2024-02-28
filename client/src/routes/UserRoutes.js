import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import NotFoundPage from "../layout/notFoundPage/pages/NotFoundPage";

import Footballers from "../footballers/pages/Footballers";
import Clubs from "../clubs/pages/Clubs";
import Agents from "../agents/pages/Agents";
import News from "../news/pages/News";
import AboutUs from "../about/pages/AboutUs";

import FootballerInfo from "../footballers/pages/FootballerInfo";
import ClubInfo from "../clubs/pages/ClubInfo";
import AgentInfo from "../agents/pages/AgentInfo";
import NewsInfo from "../news/pages/NewsInfo";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/footballers/" element={<Outlet />}>
        <Route index element={<Footballers />} />
        <Route path=":footballerId" element={<FootballerInfo />} />
      </Route>
      <Route path="/clubs/" element={<Outlet />}>
        <Route index element={<Clubs />} />
        <Route path=":clubId" element={<ClubInfo />} />
      </Route>
      <Route path="/agents/" element={<Outlet />}>
        <Route index element={<Agents />} />
        <Route path=":agentId" element={<AgentInfo />} />
      </Route>
      <Route path="/news/" element={<Outlet />}>
        <Route index element={<News />} />
        <Route path=":newsId" element={<NewsInfo />} />
      </Route>
      <Route path="/about/" element={<AboutUs />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default UserRoutes;
