"use client";

import Image from "next/image";
import Link from "next/link";
import SignOutBtn from "../global/SignOutBtn";
import styles from "./styles/dropDown.module.css";
import { useState } from "react";
//icons
import { FaRegUser } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { VscSignOut } from "react-icons/vsc";
import { signOut } from "next-auth/react";

const DropDown = ({ session }) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleHover = () => {
    setIsHovered(!isHovered);
  };

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
          <p>{session?.user?.name}</p>
          <IoClose onClick={handleHover} />
        </div>
        <div className={styles.content}>
          <Link href={`/profile/${session?.user?.id}`}>
            <FaRegUser />
            <span>Profile</span>
          </Link>
          <hr />
          <button onClick={() => signOut()}>
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
