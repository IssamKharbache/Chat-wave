"use client";
import { sideBarLinks } from "@/lib/sidebarLinks";
import Box from "../box/Box";
import styles from "./side-bar.module.css";
import Link from "next/link";
import { Typography } from "antd";
import { Icon } from "@iconify/react";
import "@/styles/typography.css";
import { usePathname } from "next/navigation";
import cx from "classnames";
import { useSettingsContext } from "@/context/provider/settings-context";
import SidebarContainer from "./SidebarContainer";
import { useCallback } from "react";

const SideBar = () => {
  const {
    settings: { isSideBarOpen },
    setSettings,
  } = useSettingsContext();
  const pathName = usePathname();
  //set active class for text
  const isActive = (link) => {
    if (link.href === pathName) return styles.active;
  };
  //set active color for text
  const activeColor = (link) => {
    return isActive(link) && "var(--text-color)";
  };
  //handle drawer open and close
  const handleDrawerClose = useCallback(() => {
    setSettings((prev) => ({ ...prev, isSideBarOpen: false }));
  }, [setSettings]);
  return (
    <SidebarContainer
      isDrawerOpen={isSideBarOpen}
      setIsDrawerOpen={handleDrawerClose}
    >
      <div className={styles.wrapper}>
        <Box className={styles.container}>
          {sideBarLinks.map((link, idx) => {
            return (
              <Link
                className={cx(styles.link, isActive(link))}
                key={idx}
                href={link.href}
              >
                <Typography>
                  <Icon
                    style={{ color: activeColor(link) }}
                    icon={link.icon}
                    width={"20px"}
                  />
                </Typography>
                <Typography
                  style={{ color: activeColor(link) }}
                  className="typoSubtitle2"
                >
                  {link.name}
                </Typography>
              </Link>
            );
          })}
        </Box>
      </div>
    </SidebarContainer>
  );
};

export default SideBar;
