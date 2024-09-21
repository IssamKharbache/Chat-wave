"use client";
import ProfileHeader from "@/components/profile/ProfileHeader";
import styles from "./profileView.module.css";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/actions/user";
import { useState } from "react";
import ProfileBody from "@/components/profile/ProfileBody";
const ProfileView = ({ userId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
  });
  const [selectedTab, setSelectedTab] = useState("1");

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* header */}
        <ProfileHeader
          userId={userId}
          userData={data}
          isLoading={isLoading}
          isError={isError}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        {/* body */}
        {selectedTab === "1" && <ProfileBody userId={userId} userData={data} />}
      </div>
    </div>
  );
};

export default ProfileView;
