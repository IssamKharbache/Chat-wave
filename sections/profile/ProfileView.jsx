"use client";
import ProfileHeader from "@/components/profile/ProfileHeader";
import styles from "./profileView.module.css";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/actions/user";
const ProfileView = ({ userId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
  });
  console.log(data);
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* header */}
        <ProfileHeader
          userId={userId}
          userData={data}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
};

export default ProfileView;
