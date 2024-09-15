"use client";
import { signIn } from "next-auth/react";

const SignInPage = () => {
  return (
    <div>
      <button
        onClick={() => {
          signIn("google");
        }}
      >
        Sign in
      </button>
    </div>
  );
};

export default SignInPage;
