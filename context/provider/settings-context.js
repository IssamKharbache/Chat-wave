"use client";

import { useContext, createContext } from "react";

export const SettingsContext = createContext({});

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("Settings  must be used within a ContextProvider");
  }
  return context;
};
