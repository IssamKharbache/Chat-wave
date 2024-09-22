"use client";

import styles from "./commentsSection.module.css";

import { Icon } from "@iconify/react";
import { Button, Flex } from "antd";
import { useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import Comment from "./Comment";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { animateScroll } from "react-scroll";

const CommentSection = ({ comments, postId, queryId }) => {
  const [expanded, setExpanded] = useState(false);
  const [parent] = useAutoAnimate();
  useEffect(() => {
    if (expanded) {
      //scroll to the bottom
      animateScroll.scrollToBottom({
        containerId: "comments-container",
        smooth: true,
        duration: 3000,
      });
    }
  });
  return (
    <Flex vertical gap={"1rem"}>
      <>
        {/* show more comments button */}
        {comments?.length > 1 && (
          <Button type="text" onClick={() => setExpanded((prev) => !prev)}>
            <Flex align="center" justify="center" gap={"0.5rem"}>
              <Icon
                icon={`${
                  expanded ? "ic:outline-expand-less" : "ic:outline-expand-more"
                }`}
                width={"25px"}
              />
              Show {expanded ? "less" : "more"} comments
            </Flex>
          </Button>
        )}
        {/* comments */}
        {comments?.length > 0 && (
          <Flex
            ref={parent}
            id="comments-container"
            gap={"0.5rem"}
            className={styles.commentsContainer}
            vertical
          >
            {!expanded ? (
              <Comment data={comments[comments.length - 1]} />
            ) : (
              comments?.map((comment, index) => (
                <Comment key={index} data={comment} />
              ))
            )}
          </Flex>
        )}
      </>
      {/* comment text area input */}
      <CommentInput
        setExpanded={setExpanded}
        queryId={queryId}
        postId={postId}
      />
    </Flex>
  );
};

export default CommentSection;
