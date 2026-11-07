"use client";
import { createContext, useContext } from "react";

export const UserContext = createContext(null);

export const useUserContext = () => {
  const context = useContext(UserContext);
  return context;
};

