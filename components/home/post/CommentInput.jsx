import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react";
import { Avatar, Button, Flex, Input } from "antd";
import React, { useState } from "react";

import styles from "./commentsSection.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "@/actions/post";
import { toast } from "sonner";

const CommentInput = ({ postId, setExpanded, queryId }) => {
  //authenticated user
  const { user } = useUser();
  //state to handle the input
  const [value, setValue] = useState("");
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: (postId) => addComment(postId, value),
    onMutate: async () => {
      setExpanded(true);
      await queryClient.cancelQueries(["posts", queryClient]);

      const prevPosts = queryClient.getQueryData(["posts", [queryId]]);

      //optimistically update the new value

      queryClient.setQueriesData(["posts", queryId], (old) => {
        return {
          ...old,
          pages: old.pages.map((page) => {
            return {
              ...page,
              data: page.data.map((post) => {
                if (post.id === postId) {
                  return {
                    ...post,
                    comments: [
                      ...post.comments,
                      {
                        comment: value,
                        authorId: user?.id,
                        author: {
                          first_name: user?.firstName,
                          last_name: user?.lastName,
                          image_url: user?.imageUrl,
                        },
                      },
                    ],
                  };
                } else {
                  return {
                    post,
                  };
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
      toast.error("Failed to comment");
      queryClient.setQueriesData(["posts"], context.prevPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["posts"]);
    },
    onSuccess: () => {
      toast.success("Commented successfully");
      setValue("");
    },
  });
  return (
    <Flex className={styles.commentInput} gap={"1rem"} align="center">
      {/* avatar */}
      <Avatar src={user?.imageUrl} size={40} style={{ minWidth: "40px" }} />

      {/* input box */}
      <Input.TextArea
        placeholder="Write a comment..."
        style={{
          resize: "none",
          background: "transparent",
          border: "2px solid #c9c2c1",
        }}
        autoSize={{ minRows: 1, maxRows: 5 }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {/* button to send comment */}
      <Button
        type="primary"
        onClick={() => mutate(postId)}
        disabled={isPending || !value || value === ""}
      >
        <Icon icon="iconamoon:send-fill" width={"1.2rem"} color="white" />
      </Button>
    </Flex>
  );
};

export default CommentInput;
