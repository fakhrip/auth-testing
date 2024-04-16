import { createContext, useContext, useState } from "react";
import { IUser, AuthContextType } from "./types/user";

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: any) {
  const [authenticatedUser, setAuthenticatedUser] = useState<IUser>({
    isAuthenticated: false
  });

  return (
    <AuthContext.Provider value={{
      user: authenticatedUser, updateUser: (user) => {
        setAuthenticatedUser({
          ...authenticatedUser,
          ...user
        })
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
}
