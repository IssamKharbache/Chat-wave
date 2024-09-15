"use client";
import Logo from "@/components/global/Logo";
import styles from "./signIn.module.css";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

//sign in with google function
const SignInPage = () => {
  const handleGoogleLogin = () => {};

  return (
    <div className={styles.container}>
      <Logo />
      <form className={styles.form}>
        <h1>Sign In</h1>
        <input type="email" className={styles.input} placeholder="Email" />
        <input
          type="password"
          className={styles.input}
          placeholder="Password"
        />
        <button className={styles.button}>Sign in</button>

        <p className={styles.or}>-OR-</p>
        <button
          onClick={() => signIn("google")}
          className={styles.buttonGoogle}
        >
          <span>Continue with Google</span>
          <FcGoogle />
        </button>
        <p className={styles.signIn}>
          Don't have an account ?
          <Link className={styles.link} href="/sign-up">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignInPage;
