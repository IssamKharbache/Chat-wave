"use client";
import { useSettingsContext } from "@/context/provider/settings-context";
import { Icon } from "@iconify/react";
import { Button } from "antd";
import React from "react";

const ThemeToggle = () => {
  const {
    setSettings,
    settings: { theme },
  } = useSettingsContext();
  if (theme === "light") {
    return (
      <Button
        style={{ padding: 0, border: "none", backgroundColor: "transparent" }}
        onClick={() => {
          setSettings((prev) => ({
            ...prev,
            theme: "dark",
          }));
        }}
        icon={<Icon icon={"logos:moon"} width={24} height={24} />}
      />
    );
  } else {
    return (
      <Button
        style={{ padding: 0, border: "none", backgroundColor: "transparent" }}
        onClick={() => {
          setSettings((prev) => ({
            ...prev,
            theme: "light",
          }));
        }}
        icon={<Icon icon={"fluent-emoji:sun"} width={24} height={24} />}
      />
    );
  }
};

export default ThemeToggle;
