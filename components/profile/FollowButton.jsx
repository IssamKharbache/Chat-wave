"use client";
import { getAllFollowersAndFollowing, updateFollow } from "@/actions/user";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Skeleton, Typography } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const FollowButton = ({ id }) => {
  const [followed, setFollowed] = useState(false);
  const { user: currentUser } = useUser();
  const queryClient = useQueryClient();

  //follow or unfollow
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", currentUser?.id, "followInfo"],
    queryFn: () => getAllFollowersAndFollowing(currentUser?.id),
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 20,
  });
  const { isPending, mutate } = useMutation({
    mutationFn: updateFollow,
    onMutate: ({ type }) => {
      setFollowed(!followed);
      // cancel outgoing requests
      queryClient.cancelQueries(["user", id, "followInfo"]);
      queryClient.cancelQueries(["user", currentUser?.id, "followInfo"]);
      //snapshot the previous data
      const snapShotOfCurrentUser = queryClient.getQueryData([
        "user",
        currentUser?.id,
        "followInfo",
      ]);

      //snapshot the target user
      const spanShotOfTargetUser = queryClient.getQueryData([
        "user",
        id,
        "followInfo",
      ]);
      queryClient.setQueryData(
        ["user", currentUser?.id, "followInfo"],
        (old) => {
          return {
            ...old,
            following:
              type === "follow"
                ? [...old.following, { followingId: id }]
                : old.following.filter((person) => person.followingId !== id),
          };
        }
      );
      queryClient.setQueryData(["user", id, "followInfo"], (old) => {
        return {
          ...old,
          followers:
            type === "follow"
              ? [...old.followers, { followerId: currentUser?.id }]
              : old.followers.filter(
                  (person) => person.followerId !== currentUser?.id
                ),
        };
      });

      return {
        snapShotOfCurrentUser,
        spanShotOfTargetUser,
      };
    },
    onError: (err, variables, context) => {
      setFollowed(!followed);
      queryClient.setQueryData(
        ["user", currentUser?.id, "followInfo"],
        context.snapShotOfCurrentUser
      );
      queryClient.setQueryData(
        ["user", id, "followInfo"],
        context.spanShotOfTargetUser
      );
      toast.error("Something wrong happened, try again later");
      console.log("Something wrong happened", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["user", currentUser?.id, "followInfo"]);
      queryClient.invalidateQueries(["user", id, "followInfo"]);
    },
  });
  useEffect(() => {
    if (data?.following?.map((person) => person?.followingId).includes(id)) {
      setFollowed(true);
    } else {
      setFollowed(false);
    }
  }, [data, setFollowed, id, isLoading]);

  if (isLoading) {
    return (
      <Skeleton.Button active={true} size="large" style={{ width: "100%" }} />
    );
  }
  if (isError) {
    return (
      <Alert
        message="Error while fetching followers and following"
        type="error"
        showIcon
      />
    );
  }
  return (
    <Button
      type="primary"
      disabled={isPending}
      onClick={() => mutate({ id, type: followed ? "unfollow" : "follow" })}
      style={{ background: "" }}
    >
      <Typography className="typoSubtitle2" style={{ color: "white" }}>
        {followed ? "Unfollow" : "Follow"}
      </Typography>
    </Button>
  );
};

export default FollowButton;
