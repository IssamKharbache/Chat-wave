"use client";
import ProfileHeader from "@/components/profile/ProfileHeader";
import styles from "./profileView.module.css";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/actions/user";
import { useState } from "react";
import ProfileBody from "@/components/profile/ProfileBody";
import FollowersPersonBody from "@/components/profile/FollowersPersonBody";
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
        {selectedTab === "2" && (
          <FollowersPersonBody type="followers" id={userId} />
        )}
        {selectedTab === "3" && (
          <FollowersPersonBody type="following" id={userId} />
        )}
      </div>
    </div>
  );
};

export default ProfileView;
