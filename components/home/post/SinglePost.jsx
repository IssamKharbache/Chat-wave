import Box from "@/components/box/Box";
import styles from "./singlepost.module.css";
import { Avatar, Flex, Image, Typography } from "antd";
import dayjs from "dayjs";
import { getFileTypeFromUrl } from "@/utils";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import CommentSection from "./CommentSection";

const SinglePost = ({ data, queryId }) => {
  return (
    <div className={styles.wrapper}>
      <Box>
        <div className={styles.container}>
          {/* header of the post (profile info) */}
          <Flex align="center" justify="space-between">
            {/* left side */}
            <Flex gap={"1rem"} align="center">
              <Avatar size={40} src={data?.author?.image_url} />
              {/* name and post data */}
              <Flex vertical>
                <Typography>{data?.author?.username}</Typography>
                <Typography.Text
                  className="typoCaption"
                  type="secondary"
                  strong
                >
                  {dayjs(data?.created_at).format("MMM DD, YYYY")}
                </Typography.Text>
              </Flex>
            </Flex>
          </Flex>
          {/* post content */}
          <Typography.Text>
            <div
              className=""
              dangerouslySetInnerHTML={{
                __html: data?.postText?.replace(/\n/g, "<br>"),
              }}
            />
          </Typography.Text>
          {/* post media */}
          {getFileTypeFromUrl(data?.media) === "image" && (
            <div className={styles.media}>
              <Image
                src={data?.media}
                alt="post media"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          {getFileTypeFromUrl(data?.media) === "video" && (
            <div className={styles.media}>
              <video src={data?.media} controls></video>
            </div>
          )}
          {/* actions (like,comment,share) */}
          <Flex align="center" gap={"1rem"}>
            <LikeButton
              postId={data?.id}
              likes={data?.likes}
              queryId={queryId}
            />

            {/* commnets */}
            <CommentButton comments={data?.comments?.length} />
          </Flex>
          {/* comment section  */}
          <CommentSection
            comments={data?.comments}
            postId={data?.id}
            queryId={queryId}
          />
        </div>
      </Box>
    </div>
  );
};

export default SinglePost;
