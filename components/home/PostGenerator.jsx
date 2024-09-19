"use client";
import { Avatar, Button, Flex, Image, Input, Spin, Typography } from "antd";
import styles from "./post-gen.module.css";
import { useUser } from "@clerk/nextjs";
import Box from "../box/Box";
import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/actions/post";

const PostGenerator = () => {
  // clerk user
  const { user } = useUser();
  //handle file states
  const imageUploadRef = useRef();
  const videoInputRef = useRef();
  const [fileType, setFileType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  //input area ref
  const postTextRef = useRef();
  const [postText, setPostText] = useState("");

  //handle remove file function
  const handleRemoveFile = () => {
    setFileType(null);
    setSelectedFile(null);
  };

  //function to handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    //limit file size to 5mb
    if (file && file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5mb");
      return;
    }
    if (
      (file && file.type.startsWith("image/")) ||
      file.type.startsWith("video/")
    ) {
      setFileType(file.type.split("/")[0]);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSelectedFile(reader.result);
      };
    }
  };

  //function to submit post
  const submitPost = () => {
    if (postText === "" || (!postText && !selectedFile)) {
      showError("You can't make an empty post");
      postTextRef.current.focus();
      return;
    }
    execute({ postText, media: selectedFile });
  };

  //show error function
  const showError = (error = "Something went wrong") => {
    toast.error(error);
  };

  //query client to create post
  const queryClient = useQueryClient();
  const { mutate: execute, isPending } = useMutation({
    mutationFn: (data) => createPost(data),
    onSuccess: () => {
      handleSuccess();
      queryClient.invalidateQueries("posts");
    },
    onError: () => showError("Something went wrong ! "),
  });

  //handle success function
  const handleSuccess = () => {
    setSelectedFile(null);
    setFileType(null);
    setPostText("");
    toast.success("Post created successfully");
  };
  return (
    <>
      <Spin
        spinning={isPending}
        tip={
          <Typography className="typoBody1" style={{ marginTop: "1rem" }}>
            Uploading your post ...
          </Typography>
        }
      >
        <div className={styles.postGenWrapper}>
          <Box className={styles.container}>
            <Flex vertical gap={"25px"} align="flex-start">
              {/* Top side */}
              <Flex style={{ width: "100%" }} gap={"1rem"}>
                <Avatar
                  style={{
                    width: "2.6rem",
                    height: "2.6rem",
                    boxShadow: "var(--avatar-shadow)",
                  }}
                  src={user?.imageUrl}
                />
                <Input.TextArea
                  ref={postTextRef}
                  className={styles.inputArea}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="What's on your mind?"
                  style={{ resize: "none", height: 80, flex: 1 }}
                />
              </Flex>
              {/* show preview of the image or video */}

              {fileType && (
                <div className={styles.previewContainer}>
                  <button onClick={handleRemoveFile} className={styles.remove}>
                    <IoClose size={25} />
                  </button>
                  {fileType === "image" && (
                    <Image
                      src={selectedFile}
                      className={styles.preview}
                      alt="preview post image"
                      height={"350px"}
                      width={"100%"}
                    />
                  )}
                  {/* video preview */}
                  {fileType === "video" && (
                    <video
                      className={styles.preview}
                      controls
                      src={selectedFile}
                      height={"350px"}
                    />
                  )}
                </div>
              )}

              {/* bottom buttons */}
              <Flex
                className={styles.bottom}
                align="center"
                justify="space-between"
              >
                {/* image upload button */}
                <Button
                  onClick={() => imageUploadRef.current.click()}
                  type="text"
                  style={{ background: "borderColor" }}
                >
                  <Flex align="center" gap={5}>
                    <Icon
                      icon="solar:camera-linear"
                      width="1.2rem"
                      color="var(--text-color)"
                    />
                    <Typography className="typoSubtitle2">Image</Typography>
                  </Flex>
                </Button>
                {/* video upload button */}
                <Button
                  onClick={() => videoInputRef.current.click()}
                  type="text"
                  style={{ background: "borderColor" }}
                >
                  <Flex align="center" gap={5}>
                    <Icon
                      icon="gridicons:video"
                      width="1.2rem"
                      color="#5856D6"
                    />
                    <Typography className="typoSubtitle2">Video</Typography>
                  </Flex>
                </Button>
                {/* post button */}
                <Button
                  onClick={submitPost}
                  type="primary"
                  style={{
                    marginLeft: "auto",
                    backgroundColor: "var(--primary)",
                  }}
                >
                  <Flex align="center" gap={".5rem"}>
                    <Icon icon="iconamoon:send-fill" width="1.2rem" />
                    <Typography
                      className="typoSubtitle2"
                      style={{ color: "white" }}
                    >
                      Post
                    </Typography>
                  </Flex>
                </Button>
              </Flex>
            </Flex>
          </Box>
        </div>
      </Spin>
      {/* hidden buttons */}
      {/* image file upload */}
      <input
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        multiple={false}
        ref={imageUploadRef}
        onChange={(e) => handleFileChange(e)}
      />
      {/* video file upload */}
      <input
        type="file"
        style={{ display: "none" }}
        accept="/*"
        multiple={false}
        ref={videoInputRef}
        onChange={(e) => handleFileChange(e)}
      />
    </>
  );
};

export default PostGenerator;
