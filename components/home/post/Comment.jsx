"use client";
import Box from "@/components/box/Box";
import { useSettingsContext } from "@/context/provider/settings-context";
import { Avatar, Flex, Typography } from "antd";
import dayjs from "dayjs";

import styles from "./commentsSection.module.css";

const Comment = ({ data }) => {
  const {
    settings: { theme },
  } = useSettingsContext();

  return (
    <Box>
      <Flex gap={"1rem"}>
        {/* avatar */}
        <Avatar
          src={data?.author?.image_url}
          size={40}
          style={{ minWidth: "40px" }}
        />
        {/* person comment */}
        <Flex vertical gap={"0.5rem"} flex={1} className={styles.comment}>
          {/* name and date */}
          <Flex align="center" justify="space-between">
            <Typography.Text strong>
              {data?.author?.first_name} {data?.author?.last_name}
            </Typography.Text>
            <Typography.Text className="typoCaption" type="secondary" strong>
              {dayjs(data?.created_at).format("MMM DD, YYYY")}
            </Typography.Text>
          </Flex>
          {/* comment text */}
          <Typography.Text style={{ fontSize: "15px" }}>
            {data?.comment}
          </Typography.Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Comment;
