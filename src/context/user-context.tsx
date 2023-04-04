import jwtDecode from "jwt-decode";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { useQuery } from "react-query";
import { useLocalStorage } from "usehooks-ts";
import { retrieveUser } from "../api";
import { isAdmin as userIsAdmin } from "../functions";
import { User } from "../types";

const UserContext = createContext({
  user: null as User | null,
  isAdmin: false,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useLocalStorage<string | null>("token", null);
  const id = useMemo(() => {
    if (!token) return;
    try {
      const { sub } = jwtDecode(token) as any;
      return +sub;
    } catch (error) {
      return;
    }
  }, [token]);
  const { data: user } = useQuery(["users", id], () => retrieveUser(id), {
    enabled: !!id,
    onError: () => setToken(null),
  });

  return (
    <UserContext.Provider value={{ user, isAdmin: userIsAdmin(user) }}>
      {children}
    </UserContext.Provider>
  );
}
export function useAuth() {
  return useContext(UserContext);
}
