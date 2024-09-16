import Box from "@/components/box/Box";
import { SettingsContextProvider } from "@/context/provider/settings-provider";
import ThemeProvider from "@/lib/themeProvider";
import React from "react";
import styles from "@/styles/homeLayout.module.css";
import Header from "@/components/header/Header";

const HomeLayout = ({ children }) => {
  return (
    <SettingsContextProvider>
      <ThemeProvider>
        <Box
          style={{ position: "relative", width: "100vw", height: "100vh" }}
          type="baseBg"
        >
          <div className={styles.wraper}>
            {/* Header */}
            <Header />
          </div>
        </Box>
      </ThemeProvider>
    </SettingsContextProvider>
  );
};

export default HomeLayout;
