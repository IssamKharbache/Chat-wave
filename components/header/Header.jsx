import { Flex } from "antd";
import Box from "../box/Box";
import Logo from "../global/Logo";
import styles from "./styles/header.module.css";
import ThemeToggle from "./ThemeToggle";
import UserProfile from "./UserProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className={styles.wrapper}>
      <Box style={{ height: "100%" }}>
        <div className={styles.container}>
          <h1 className={styles.logo}>Chat wave</h1>
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
