"use client";
import { updatePostLike } from "@/actions/post";
import { HappyProvider } from "@ant-design/happy-work-theme";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react";
import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Typography } from "antd";
import { useEffect, useState } from "react";

const LikeButton = ({ postId, queryId, likes }) => {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const actionType = isLiked ? "unlike" : "like";
  useEffect(() => {
    setIsLiked(likes?.some((like) => like?.authorId == user?.id));
  }, [user, likes]);
  const { mutate } = useMutation({
    mutationFn: (postId, actionType) => updatePostLike(postId, actionType),
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
