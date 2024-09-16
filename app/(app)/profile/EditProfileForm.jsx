"use client";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import styles from "./profile.module.css";
import { toast } from "sonner";
import Loader from "@/components/global/Loader";

const EditProfileForm = ({ session }) => {
  //states to handle form
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //update funtion
  const onHandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${session?.user?.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
        }),
      });
      const { message } = await res.json();
      console.log(message);
      if (!message === "success") {
        setLoading(false);
      }
      if (message === "dupKey") {
        setError("Email already used , try a different one !");
        setLoading(false);
      }

      if (res.ok) {
        toast.success("Profile updated successfully");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const res = await fetch(`/api/users/${session?.user?.email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = await res.json();
      setEmail(data.email);
      setUsername(data.username);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2>My Profile</h2>
        <form onSubmit={onHandleSubmit}>
          <div className={styles.info}>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.eachInfo}>
              <h1>Email</h1>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                defaultValue={email}
                className={styles.input}
              />
            </div>
            <div className={styles.eachInfo}>
              <h1>Username</h1>
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                defaultValue={username}
                className={styles.input}
              />
            </div>
            {loading ? (
              <button className={styles.loading}>
                <Loader />
              </button>
            ) : (
              <div className={styles.button}>
                <button>
                  <CiEdit />
                  <span>Update</span>
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
