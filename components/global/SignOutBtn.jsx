"use client";
import { signOut } from "next-auth/react";
import styles from "./signout.module.css";
//icons
import { PiSignOut } from "react-icons/pi";
const SignOutBtn = () => {
  return (
    <button onClick={() => signOut()} className={styles.signout}>
      <PiSignOut />
      <span>Sign out</span>
    </button>
  );
};

export default SignOutBtn;
