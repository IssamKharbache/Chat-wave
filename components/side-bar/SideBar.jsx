"use client";
import { sideBarLinks } from "@/lib/sidebarLinks";
import Box from "../box/Box";
import styles from "./side-bar.module.css";
import Link from "next/link";
import { Typography } from "antd";
import { Icon } from "@iconify/react";
import SignOutBtn from "../global/SignOutBtn";
import "@/styles/typography.css";
import { usePathname, useRouter } from "next/navigation";
import cx from "classnames";

const SideBar = () => {
  const pathName = usePathname();
  const isActive = (link) => {
    if (link.href === pathName) return styles.active;
  };
  const activeColor = (link) => {
    return isActive(link) && "var(--text-color)";
  };
  return (
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
        <SignOutBtn />
      </Box>
    </div>
  );
};

export default SideBar;
