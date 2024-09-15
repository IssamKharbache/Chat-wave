"use client";
import Logo from "@/components/global/Logo";
import styles from "./signIn.module.css";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/global/Loader";

//sign in with google function
const SignInPage = () => {
  //states to handle the form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //router

  const router = useRouter();

  //handle submit function
  const handleSubmit = async (e) => {
    //set loading to true
    setLoading(true);
    //prevent default behaviour
    e.preventDefault();
    //check if all fields are filled
    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res.error) {
        setError("Email or password is incorrect");
        setLoading(false);
      }
      router.replace("/profile");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <Logo />
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Sign In</h1>
        {error && <p className={styles.error}>{error}</p>}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className={styles.input}
          placeholder="Email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className={styles.input}
          placeholder="Password"
        />
        {loading ? (
          <button className={styles.loading}>
            <Loader size={12} />
          </button>
        ) : (
          <button className={styles.button}>Sign in</button>
        )}

        <p className={styles.or}>-OR-</p>
        <button
          type="button"
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
