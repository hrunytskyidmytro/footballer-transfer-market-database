import React from "react";

import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import { useUser } from "./shared/hooks/user-hook";

import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const { token, login, logout, userId, role } = useAuth();
  const { user, isLoading, error, clearError } = useUser(userId);

  return (
    <>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          role: role,
          login: login,
          logout: logout,
          user: user,
          isLoadingApp: isLoading,
          error: error,
          clearError: clearError,
        }}
      >
        <AppRoutes />
      </AuthContext.Provider>
    </>
  );
};

export default App;
