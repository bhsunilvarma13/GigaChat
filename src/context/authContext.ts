import { createContext } from "react";

const AuthContext = createContext<{
  authStatus: boolean;
  setAuthStatus: (status: boolean) => void;
}>({
  authStatus: false,
  setAuthStatus: () => {},
});

const AuthProvider = AuthContext.Provider;

export { AuthContext, AuthProvider };
