import Logo from "@/components/global/Logo";
import styles from "./singUp.module.css";
import Link from "next/link";

const SignUpPage = () => {
  return (
    <div className={styles.container}>
      <Logo />
      <form className={styles.form}>
        <h1>Sign up</h1>
        <input type="text" className={styles.input} placeholder="Username" />
        <input type="email" className={styles.input} placeholder="Email" />
        <input
          type="password"
          className={styles.input}
          placeholder="Password"
        />
        <button className={styles.button}>Sign Up</button>
        <p className={styles.signIn}>
          Already have an account ?{" "}
          <Link className={styles.link} href="/sign-in">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
