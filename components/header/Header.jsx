import { Flex } from "antd";
import Box from "../box/Box";
import styles from "./styles/header.module.css";
import ThemeToggle from "./ThemeToggle";
import UserProfile from "./UserProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import SideBarButton from "../side-bar/SideBarButton";

const Header = async () => {
  const session = await getServerSession(authOptions);

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
            {session ? (
              <UserProfile />
            ) : (
              <Link href="/sign-in" className={styles.signinBtn}>
                {" "}
                Sign in
              </Link>
            )}
          </Flex>
        </div>
      </Box>
    </div>
  );
};

export default Header;
