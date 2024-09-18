import styles from "@/styles/authLayout.module.css";
import Image from "next/image";
export const metadata = {
  title: "Authentication",
};
const AuthLayout = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.left}>{children}</div>
        <div className={styles.right}>
          <Image
            alt="Auth"
            src="/social.png"
            width={400}
            height={480}
            quality={100}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
