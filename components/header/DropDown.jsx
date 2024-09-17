"use client";

import Image from "next/image";
import Link from "next/link";
import SignOutBtn from "../global/SignOutBtn";
import styles from "./styles/dropDown.module.css";
import { useEffect, useState } from "react";
//icons
import { FaRegUser } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { VscSignOut } from "react-icons/vsc";
import { signOut } from "next-auth/react";

const DropDown = ({ session, provider }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [data, setData] = useState([]);
  const handleHover = () => {
    setIsHovered(!isHovered);
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
        setData(data);
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.profile} onClick={handleHover}>
        {session?.user?.image ? (
          <Image
            src={session?.user?.image}
            width={40}
            height={40}
            alt="profile"
          />
        ) : (
          <div className={styles.profileIcon}>
            <FaRegUser />
          </div>
        )}
      </div>

      <div className={isHovered ? styles.hovered : styles.container}>
        <div className={styles.header}>
          <p>{data.username}</p>
          <IoClose onClick={handleHover} />
        </div>
        <div className={styles.content}>
          <Link
            onClick={() => setIsHovered(false)}
            href={`/profile/${session?.user?.id}`}
          >
            <FaRegUser />
            <span>Profile</span>
          </Link>
          <hr />
          <button
            onClick={() => {
              signOut();
              setIsHovered(false);
            }}
          >
            <VscSignOut />
            <span>Sign out</span>
          </button>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default DropDown;
