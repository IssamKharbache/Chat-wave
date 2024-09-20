"use client";

import { useSettingsContext } from "@/context/provider/settings-context";
import { ConfigProvider, theme } from "antd";
import { useCallback } from "react";

const ThemeProvider = ({ children }) => {
  const {
    settings: { theme: globalTheme },
  } = useSettingsContext();

  const BoxBg = useCallback(() => {
    return globalTheme === "dark" ? "rgb(33,43,54)" : "rgb(179, 139, 194)";
  }, [globalTheme]);

  const BaseBg = useCallback(() => {
    return globalTheme === "dark" ? "black" : "rgb(202, 175, 212)";
  }, [globalTheme]);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          globalTheme === "light"
            ? theme.defaultAlgorithm
            : theme.darkAlgorithm,
        token: {
          fontFamily: "inherit",
          colorPrimary: "#9c4aba",
          boxBg: BoxBg(),
          baseBg: BaseBg(),
        },
        components: {
          Typography: {
            fontSize: "none",
            lineHeight: "none",
            fontWeightStrong: "none",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;
