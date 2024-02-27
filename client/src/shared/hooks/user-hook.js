import { useState, useEffect } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";

export const useUser = (userId) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId) {
          const responseData = await sendRequest(
            `http://localhost:5001/api/users/${userId}`
          );

          setUser(responseData.user);
        }
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, userId]);

  return { user, isLoading, error, clearError };
};
