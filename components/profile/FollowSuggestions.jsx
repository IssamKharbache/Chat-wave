"use client";
import { useUser } from "@clerk/nextjs";
import styles from "./followSuggestions.module.css";
import { useQuery } from "@tanstack/react-query";
import { getFollowSuggestions } from "@/actions/user";
import Box from "../box/Box";
import { Alert, Avatar, Flex, Skeleton, Typography } from "antd";
import UserSuggestionBox from "./UserSuggestionBox";

const FollowSuggestions = () => {
  const { user: currentUser } = useUser();

  //getting the suggestions
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", "followSuggestions"],
    queryFn: () => getFollowSuggestions(),
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 20,
  });
  return (
    <div className={styles.wrapper}>
      <Box>
        <div className={styles.container}>
          <div className={styles.title}>
            <Typography className="typoSubtitle1">
              People you may know
            </Typography>
          </div>
          {/* when loading */}
          {isLoading && (
            <Flex vertical gap={"1rem"}>
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Flex key={i} gap={"1rem"} align="center">
                    <Avatar size={40} />
                    <Flex vertical>
                      <Typography.Text className="typoSubtitle2" strong>
                        <Skeleton.Input active size="small" />
                      </Typography.Text>
                      <Typography.Text
                        className="typoCaption"
                        strong
                        type="secondary"
                      >
                        <Skeleton.Input
                          active
                          size="small"
                          style={{ height: "0.5rem", marginTop: ".4rem" }}
                        />
                      </Typography.Text>
                    </Flex>
                  </Flex>
                ))}
            </Flex>
          )}
          {/* when error */}
          {isError && (
            <Alert
              message="Error"
              description="Something went wrong"
              type="error"
              showIcon
            />
          )}
          {/* suggestion list */}
          {!isLoading && !isError && data?.length > 0
            ? data?.map((user, i) => (
                <UserSuggestionBox
                  loggedInUser={currentUser}
                  key={user?.id}
                  data={{ follower: user }}
                  type="follower"
                />
              ))
            : !isLoading &&
              !isError &&
              data?.length === 0 && (
                <Typography.Text type="secondary">
                  No suggestions
                </Typography.Text>
              )}
        </div>
      </Box>
    </div>
  );
};

export default FollowSuggestions;
