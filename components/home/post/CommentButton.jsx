import { Icon } from "@iconify/react";
import { Button, Flex, Typography } from "antd";
import React from "react";

const CommentButton = ({ comments }) => {
  return (
    <Button type="text" size="small">
      <Flex gap={"0.5rem"} align="center">
        <Icon icon="ant-design:comment-outlined" width={"21px"} color="black" />
        <Typography.Text>
          {comments > 0 ? `${comments} Comments` : "Comment"}
        </Typography.Text>
      </Flex>
    </Button>
  );
};

export default CommentButton;
