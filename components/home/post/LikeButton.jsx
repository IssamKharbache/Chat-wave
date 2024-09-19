"use client";
import { updatePostLike } from "@/actions/post";
import { updateQueryCacheLikes } from "@/utils";
import { HappyProvider } from "@ant-design/happy-work-theme";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Typography } from "antd";
import { useEffect, useState } from "react";

const LikeButton = ({ postId, queryId, likes }) => {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const actionType = isLiked ? "unlike" : "like";
  const queryClient = useQueryClient();
  useEffect(() => {
    setIsLiked(likes?.some((like) => like?.authorId == user?.id));
  }, [user, likes]);
  const { mutate } = useMutation({
    mutationFn: (postId, actionType) => updatePostLike(postId, actionType),
    onMutate: async () => {
      await queryClient.cancelQueries(["posts", queryId]);
      //snapshot the previous value
      const prevPosts = await queryClient.getQueryData(["posts", queryId]);
      //optimistically update the value
      queryClient.setQueryData(["posts", queryId], (oldData) => {
        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              data: page.data.map((post) => {
                if (post.id === postId) {
                  return {
                    ...post,
                    likes: updateQueryCacheLikes(
                      post.likes,
                      postId,
                      user.id,
                      actionType
                    ),
                  };
                } else {
                  return post;
                }
              }),
            };
          }),
        };
      });
      return {
        prevPosts,
      };
    },
    onError: (err, variables, context) => {
      console.log("This is error", err);
      queryClient.setQueriesData(["posts", queryId], context.prevPosts);
    },
    //always refetch the query after success or error
    onSettled: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });
  return (
    <HappyProvider>
      <Button
        size="small"
        style={{ background: "transparent", border: "none", boxShadow: "none" }}
        onClick={() => mutate(postId, actionType)}
      >
        <Flex align="center" gap={"0.5rem"}>
          <Icon
            icon="ph:heart-fill"
            width={22}
            height={22}
            style={{
              color: isLiked ? "red" : "grey",
            }}
          />
          <Typography.Text className="typoBody2">
            {likes?.length === 0 ? "Like" : `${likes?.length} Likes`}
          </Typography.Text>
        </Flex>
      </Button>
    </HappyProvider>
  );
};
export default LikeButton;
