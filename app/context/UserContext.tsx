"use client";
import { createContext } from "react";

export const UserContext = createContext<any>(null);

export default function UserProvider({ children, user }: any) {
	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}