import Logo from "@/components/global/Logo";
import styles from "./singUp.module.css";

const SignUpPage = () => {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <Logo />
        <input type="text" className={styles.input} placeholder="Username" />
        <input type="email" className={styles.input} placeholder="Email" />
        <input
          type="password"
          className={styles.input}
          placeholder="Password"
        />
        <button className={styles.button}>Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;
