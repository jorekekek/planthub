import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { login as loginRequest } from "../api/client";
import {
  getToken,
  removeToken,
  saveToken,
} from "../auth/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await getToken();
        setAuthenticated(Boolean(token));
      } catch (error) {
        console.error("AUTH RESTORE ERROR:", error);
        setAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    }

    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await loginRequest(email, password);

    await saveToken(result.token);
    setAuthenticated(true);

    return result;
  }, []);

  const logout = useCallback(async () => {
    await removeToken();
    setAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      authenticated,
      checkingAuth,
      login,
      logout,
    }),
    [authenticated, checkingAuth, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider",
    );
  }

  return context;
}