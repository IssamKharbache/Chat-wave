"use client";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Box from "../box/Box";
import styles from "./userBox.module.css";
import { Avatar, Button, Flex, Typography } from "antd";
import { Icon } from "@iconify/react";
import { useSettingsContext } from "@/context/provider/settings-context";
import { updateFollow } from "@/actions/user";
import { toast } from "sonner";

const UserSuggestionBox = ({ data, type, loggedInUser }) => {
  const [followed, setFollowed] = useState(false);
  const { user: currentUser } = useUser();
  const personId = data?.[type]?.id;

  const queryClient = useQueryClient();

  const {
    settings: { theme },
  } = useSettingsContext();

  useEffect(() => {
    if (
      loggedInUser?.following
        ?.map((person) => person?.followingId)
        .includes(data?.[type === "follower" ? "followerId" : "followingId"])
    ) {
      setFollowed(true);
    } else {
      setFollowed(false);
    }
  }, [loggedInUser, data, setFollowed, type]);
  //follow or unfollow
  const { mutate, isPending } = useMutation({
    mutationFn: updateFollow,
    onMutate: async (params) => {
      //cancel outgoing requests
      await queryClient.cancelQueries(["user", currentUser?.id, "followInfo"]);
      await queryClient.cancelQueries(["user", personId, "followInfo"]);
      await queryClient.cancelQueries(["user", "followSuggestions"]);

      //snapshot the previous data
      const prevData = queryClient.getQueryData([
        "user",
        currentUser?.id,
        "followInfo",
      ]);
      //optimistic update
      queryClient.setQueryData(
        ["user", currentUser?.id, "followInfo"],
        (old) => {
          const newData = {
            ...old,
            followinng:
              params?.type === "follow"
                ? [
                    ...old?.following,
                    {
                      followingId: params.id,
                      followerId: currentUser?.id,
                      following: data[type],
                    },
                  ]
                : old.following.filter(
                    (person) => person.followingId !== params.id
                  ),
          };
          return newData;
        }
      );
      //update follow suggestion
      queryClient.setQueryData(["user", "followSuggestions"], (old) => {
        return old?.filter((person) => person?.id !== params.id);
      });
      return { prevData };
    },
    onError: (err, variables, context) => {
      toast.error("Something wrong happened, try again later");
      console.log("Something wrong happened", err);
      queryClient.setQueryData(
        ["user", currentUser?.id, "followInfo"],
        context.prevData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["user", currentUser?.id, "followInfo"]);
      queryClient.invalidateQueries(["user", personId, "followInfo"]);
      queryClient.invalidateQueries(["user", "followSuggestions"]);
    },
  });

  return (
    <Box
      style={{
        backgroundColor:
          theme === "dark" ? "rgb(33,43,54)" : "var(--primary-low)",
      }}
      className={styles.container}
    >
      {/* LEFT SIDE */}
      <div className={styles.left}>
        <Avatar size={40} src={data?.[type]?.image_url} />
        <div className={styles.details}>
          <Typography.Text className="typoSubtitle2" strong>
            {data?.[type]?.first_name} {data?.[type]?.last_name}
          </Typography.Text>
          <Typography.Text className="typoCaption" strong type="secondary">
            @{data?.[type]?.username}
          </Typography.Text>
        </div>
      </div>
      {/* RIGHT SIDE */}
      {data?.[type]?.id === currentUser?.id ? (
        <div lassName={styles.right}></div>
      ) : (
        <div className={styles.right}>
          {!followed ? (
            <Button
              onClick={() => mutate({ id: personId, type: "follow" })}
              type="text"
              size="small"
              className={styles.button}
              style={{ padding: "1rem" }}
            >
              <Typography.Text type="secondary">
                {isPending ? "Loading..." : "Follow"}
              </Typography.Text>
            </Button>
          ) : (
            <Button
              onClick={() => mutate({ id: personId, type: "unfollow" })}
              type="text"
              size="small"
              style={{ padding: "1rem" }}
            >
              <Flex gap={"10px"} align="center">
                <Icon icon="charm:tick" width={18} color="#3db66a" />
                <Typography.Text type="secondary">
                  {isPending ? "Loading..." : "Unfollow"}
                </Typography.Text>
              </Flex>
            </Button>
          )}
        </div>
      )}
    </Box>
  );
};

export default UserSuggestionBox;
