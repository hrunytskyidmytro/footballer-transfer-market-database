import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  role: null,
  login: () => {},
  logout: () => {},
  user: null,
  isLoadingApp: true,
  error: null,
  clearError: null,
});
