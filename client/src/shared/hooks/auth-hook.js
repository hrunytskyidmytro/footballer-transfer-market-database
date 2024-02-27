import { useState, useCallback, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import { message } from "antd";

let logoutTimer;

export const useAuth = () => {
  const navigate = useNavigate();
  const storedData = JSON.parse(localStorage.getItem("userData"));
  const [token, setToken] = useState(storedData?.token);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(storedData?.userId);
  const [role, setRole] = useState(storedData?.role);

  const login = useCallback((uid, token, userRole, expirationDate) => {
    setToken(token);
    setUserId(uid);
    setRole(userRole);

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate); // new Date (was changed)

    try {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token: token,
          role: userRole,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
    } catch (err) {
      console.error("LocalStorage Error:", err);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setRole(null);
    localStorage.removeItem("userData");
  }, []);

  useLayoutEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(() => {
        logout();
        navigate("/");
        message.warning("Your login time has expired, please log in again.");
      }, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useLayoutEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.role,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userId, role };
};
