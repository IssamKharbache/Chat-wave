import Box from "@/components/box/Box";
import { SettingsContextProvider } from "@/context/provider/settings-provider";
import ThemeProvider from "@/lib/themeProvider";
import React from "react";
import styles from "@/styles/homeLayout.module.css";
import Header from "@/components/header/Header";
import SideBar from "@/components/side-bar/SideBar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const HomeLayout = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <SettingsContextProvider>
      <ThemeProvider>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Box
            style={{ position: "relative", width: "100vw", height: "100vh" }}
            type="baseBg"
          >
            <div className={styles.wrapper}>
              {/* Header */}
              <Header />
              <div className={styles.container}>
                <SideBar />
                <div className={styles.body}>{children}</div>
              </div>
            </div>
          </Box>
        </HydrationBoundary>
      </ThemeProvider>
    </SettingsContextProvider>
  );
};

export default HomeLayout;
