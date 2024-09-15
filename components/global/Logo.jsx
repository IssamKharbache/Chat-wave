import Image from "next/image";
import styles from "./logo.module.css";
const Logo = () => {
  return (
    <div className={styles.logoContainer}>
      <h1 className={styles.logo}>Chat wave</h1>
    </div>
  );
};

export default Logo;
