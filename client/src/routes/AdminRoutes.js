import React, { useEffect, useState, useContext } from "react";
import { Route, Routes, Outlet } from "react-router-dom";

import NotFoundPageAdmin from "../admin/notFoundPageAdmin/pages/NotFoundPageAdmin";

import NewFootballer from "../admin/footballers/pages/NewFootballer";
import UpdateFootballer from "../admin/footballers/pages/UpdateFootballer";
import UpdateUser from "../admin/users/pages/UpdateUser";
import NewAgent from "../admin/agents/pages/NewAgent";
import UpdateAgent from "../admin/agents/pages/UpdateAgent";
import NewNews from "../admin/news/pages/NewNews";
import UpdateNews from "../admin/news/pages/UpdateNews";
import NewTransfer from "../admin/transfers/pages/NewTransfer";
import UpdateTransfer from "../admin/transfers/pages/UpdateTransfer";
import NewClub from "../admin/clubs/pages/NewClub";
import UpdateClub from "../admin/clubs/pages/UpdateClub";

import Users from "../admin/users/pages/Users";
import Footballers from "../admin/footballers/pages/Footballers";
import Transfers from "../admin/transfers/pages/Transfers";
import Clubs from "../admin/clubs/pages/Clubs";
import Agents from "../admin/agents/pages/Agents";
import News from "../admin/news/pages/News";
import Statistics from "../admin/statistics/pages/Statistics";
import AdminHome from "../admin/adminHomePage/pages/AdminHome";

import { useHttpClient } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";

const AdminRoutes = () => {
  const { sendRequest } = useHttpClient();
  const { role } = useContext(AuthContext);
  const [loadedusers, setLoadedUsers] = useState();
  const [loadedFootballers, setLoadedFootballers] = useState();
  const [loadedTransfers, setLoadedTransfers] = useState();
  const [loadedClubs, setLoadedClubs] = useState();
  const [loadedAgents, setLoadedAgents] = useState();
  const [loadedNews, setLoadedNews] = useState();

  const isAdmin = role === "admin";
  const isFootballManager = role === "football_manager";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/admins/users"
        );

        setLoadedUsers(responseData.users.length);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  useEffect(() => {
    const fetchFootballers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/admins/footballers"
        );

        setLoadedFootballers(responseData.footballers.length);
      } catch (err) {}
    };
    fetchFootballers();
  }, [sendRequest]);

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/admins/transfers"
        );

        setLoadedTransfers(responseData.transfers.length);
      } catch (err) {}
    };
    fetchTransfers();
  }, [sendRequest]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/admins/clubs"
        );

        setLoadedClubs(responseData.clubs.length);
      } catch (err) {}
    };
    fetchClubs();
  }, [sendRequest]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/admins/agents"
        );

        setLoadedAgents(responseData.agents.length);
      } catch (err) {}
    };
    fetchAgents();
  }, [sendRequest]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/admins/news"
        );

        setLoadedNews(responseData.news.length);
      } catch (err) {}
    };
    fetchNews();
  }, [sendRequest]);

  return (
    <Routes>
      {(isAdmin || isFootballManager) && (
        <Route
          index
          element={
            <AdminHome
              numUsers={loadedusers}
              numFootballers={loadedFootballers}
              numTransfers={loadedTransfers}
              numClubs={loadedClubs}
              numAgents={loadedAgents}
              numNews={loadedNews}
            />
          }
        />
      )}
      {isAdmin && (
        <>
          <Route path="/users/" element={<Outlet />}>
            <Route index element={<Users />} />
            <Route path=":userId" element={<UpdateUser />} />
          </Route>
          <Route path="/footballers/" element={<Outlet />}>
            <Route index element={<Footballers />} />
            <Route path="new" element={<NewFootballer />} />
            <Route path=":footballerId" element={<UpdateFootballer />} />
          </Route>
          <Route path="/transfers/" element={<Outlet />}>
            <Route index element={<Transfers />} />
            <Route path="new" element={<NewTransfer />} />
            <Route path=":transferId" element={<UpdateTransfer />} />
          </Route>
          <Route path="/clubs/" element={<Outlet />}>
            <Route index element={<Clubs />} />
            <Route path="new" element={<NewClub />} />
            <Route path=":clubId" element={<UpdateClub />} />
          </Route>
          <Route path="/agents/" element={<Outlet />}>
            <Route index element={<Agents />} />
            <Route path="new" element={<NewAgent />} />
            <Route path=":agentId" element={<UpdateAgent />} />
          </Route>
          <Route path="/news/" element={<Outlet />}>
            <Route index element={<News />} />
            <Route path="new" element={<NewNews />} />
            <Route path=":newId" element={<UpdateNews />} />
          </Route>
          <Route path="/statistics/" element={<Statistics />} />
        </>
      )}
      {isFootballManager && (
        <>
          <Route path="/footballers/" element={<Outlet />}>
            <Route index element={<Footballers />} />
            <Route path="new" element={<NewFootballer />} />
            <Route path=":footballerId" element={<UpdateFootballer />} />
          </Route>
          <Route path="/transfers/" element={<Outlet />}>
            <Route index element={<Transfers />} />
            <Route path="new" element={<NewTransfer />} />
            <Route path=":transferId" element={<UpdateTransfer />} />
          </Route>
          <Route path="/clubs/" element={<Outlet />}>
            <Route index element={<Clubs />} />
            <Route path="new" element={<NewClub />} />
            <Route path=":clubId" element={<UpdateClub />} />
          </Route>
          <Route path="/agents/" element={<Outlet />}>
            <Route index element={<Agents />} />
            <Route path="new" element={<NewAgent />} />
            <Route path=":agentId" element={<UpdateAgent />} />
          </Route>
        </>
      )}
      <Route path="*" element={<NotFoundPageAdmin />} />
    </Routes>
  );
};

export default AdminRoutes;
