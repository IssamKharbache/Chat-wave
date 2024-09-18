import { Flex } from "antd";
import Box from "../box/Box";
import styles from "./styles/header.module.css";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import SideBarButton from "../side-bar/SideBarButton";
import { UserButton } from "@clerk/nextjs";

const Header = async () => {
  return (
    <div className={styles.wrapper}>
      <Box style={{ height: "100%" }}>
        <div className={styles.container}>
          {/* open side bar responsinve button */}
          <div className={styles.sidebarButton}>
            <SideBarButton />
          </div>
          {/* logo */}
          <Link href="/" className={styles.logo}>
            Chat wave
          </Link>
          <Flex gap={25} align="center">
            {/* Theme button */}
            <ThemeToggle />
            {/* user profile */}
            <UserButton afterSignOutUrl="/sign-in" />
          </Flex>
        </div>
      </Box>
    </div>
  );
};

export default Header;
