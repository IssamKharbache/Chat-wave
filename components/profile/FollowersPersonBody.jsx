import { getAllFollowersAndFollowing } from "@/actions/user";
import { useQuery } from "@tanstack/react-query";
import { Alert, Skeleton, Typography } from "antd";
import styles from "./followers.module.css";
import UserSuggestionBox from "./UserSuggestionBox";
import { useUser } from "@clerk/nextjs";

const FollowersPersonBody = ({ id, type }) => {
  const { user: currentUser } = useUser();
  const {
    data: userData,
    isLoading: userDataLoading,
    isError: userDataError,
  } = useQuery({
    queryKey: ["user", id, "followInfo"],
    queryFn: () => getAllFollowersAndFollowing(id),
    enabled: !!id,
    //20min stale time
    staleTime: 1000 * 60 * 20,
  });
  //
  const { data: currentUserData } = useQuery({
    queryKey: ["user", currentUser?.id, "followInfo"],
    queryFn: () => getAllFollowersAndFollowing(currentUser?.id),
    enabled: !!currentUser?.id,
    //20min stale time
    staleTime: 1000 * 60 * 20,
  });
  if (userDataLoading) {
    return (
      <Skeleton.Button active={true} size="large" style={{ width: "100%" }} />
    );
  }
  if (userDataError) {
    return (
      <Alert
        message="Error while fetching followers and following"
        type="error"
        showIcon
      />
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <Typography.Text className="typoH5">{type}</Typography.Text>
      </div>
      {userData?.[type]?.length === 0 ? (
        <Alert message={`No ${type} `} type="info" showIcon />
      ) : (
        <div className={styles.body}>
          {userData?.[type]?.map((person, idx) => (
            <UserSuggestionBox
              key={person?.[type === "followes" ? "followerId" : "followingId"]}
              data={person}
              type={type === "followers" ? "follower" : "following"}
              loggedInUser={currentUserData}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowersPersonBody;
