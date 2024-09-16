"use client";
import Logo from "@/components/global/Logo";
import styles from "./singUp.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/global/Loader";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const SignUpPage = () => {
  //states to handle the form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //router
  const router = useRouter();
  //session
  const session = useSession();
  useEffect(() => {
    if (session?.status === "authenticated") {
      redirect("/");
    }
  }, [session, router]);
  //handle submit button
  const handleSubmit = async (e) => {
    //set loading to true
    setLoading(true);
    //prevent default behaviour
    e.preventDefault();
    //check if all fields are filled
    if (!username || !email || !password) {
      setError("Please, fill all the fields");
      setLoading(false);
      return;
    }
    //try to register the user
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username,
        }),
      });
      //if the user already exists
      if (response.status === 400) {
        setError("User already exists, Try with a different email");
      }
      //if the user is created successfully
      if (response.ok) {
        setError("");
        setLoading(false);
        setEmail("");
        setPassword("");
        setUsername("");
        toast.success("Account created successfully");
        router.push("/sign-in");
      } else {
        setLoading(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Logo />
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Sign up</h1>
        {error && <p className={styles.error}>{error}</p>}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          className={styles.input}
          placeholder="Username"
        />
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
          <button className={styles.button}>Sign Up</button>
        )}

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
