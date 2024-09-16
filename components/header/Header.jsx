import { Flex } from "antd";
import Box from "../box/Box";
import Logo from "../global/Logo";
import styles from "./header.module.css";
import ThemeToggle from "./ThemeToggle";
import UserProfile from "./UserProfile";

const Header = () => {
  return (
    <div className={styles.wrapper}>
      <Box style={{ height: "100%" }}>
        <div className={styles.container}>
          <h1 className={styles.logo}>Chat wave</h1>
          <Flex gap={25} align="center">
            {/* Theme button */}
            <ThemeToggle />
            {/* user profile */}
            <UserProfile />
          </Flex>
        </div>
      </Box>
    </div>
  );
};

export default Header;
