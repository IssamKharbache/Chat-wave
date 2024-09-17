"use client";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import styles from "./profile.module.css";
import { toast } from "sonner";
import Loader from "@/components/global/Loader";
import { SyncLoader } from "react-spinners";

const EditProfileForm = ({ session }) => {
  //states to handle form
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingData, setIsLoadingData] = useState(true);
  const provider = session?.user?.provider;

  //update funtion
  const onHandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let url;
    if (provider === "google") {
      url = `/api/users/google/${session?.user?.email}`;
    } else {
      url = `/api/users/${session?.user?.id}`;
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
        }),
      });
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
    let url;
    if (provider === "google") {
      url = `/api/users/google/${session?.user?.email}`;
    } else {
      url = `/api/users/${session?.user?.id}`;
    }
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const { data } = await res.json();
        setEmail(data.email);
        setUsername(data.username);
        setIsLoadingData(false);
      } else {
        setIsLoadingData(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoadingData(false);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2>My Profile</h2>
        {loadingData ? (
          <div className={styles.loadingSpinner}>
            <SyncLoader size={45} color="rgb(164, 111, 185)" />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default EditProfileForm;
