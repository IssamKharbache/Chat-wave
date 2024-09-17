import useWindowDimensions from "@/hooks/useWindowsDimension";
import { Drawer } from "antd";
import styles from "./side-bar.module.css";
const SidebarContainer = ({
  children,
  isDrawerOpen,
  setIsDrawerOpen,
  ...other
}) => {
  const { width } = useWindowDimensions();
  if (width <= 1268) {
    return (
      <Drawer
        open={isDrawerOpen}
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
        {...other}
        height={"100%"}
        className={styles.sidebarContainer}
      >
        <div className={styles.drawerContainer}>{children}</div>
      </Drawer>
    );
  } else {
    return children;
  }
};

export default SidebarContainer;
