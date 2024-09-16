"use client";
import { useSettingsContext } from "@/context/provider/settings-context";
import React from "react";

const MainPage = () => {
  const {
    settings: { theme },
  } = useSettingsContext();
  return <h1>MAIN</h1>;
};

export default MainPage;
