"use client";
import { getMyFeedPosts } from "@/actions/post";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Flex, Spin } from "antd";
import Typography from "antd/es/typography/Typography";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Post = () => {
  //ref to handle last post view
  const { ref, inView } = useInView();
  const checkLastViewRef = (index, page) => {
    if (index === page.data.length - 1) {
      return true;
    } else {
      return false;
    }
  };

  // states for the query
  const {
    data,
    isLoading,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: "posts",
    queryFn: ({ pageParam = "" }) => getMyFeedPosts(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData?.lastCursor;
    },
  });
  //use effect to check if we need to fetch the next page
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);
  //check if there is an error
  if (isError) {
    return <Typography>Something went wrong !</Typography>;
  }
  // check if we loading data
  if (isLoading) {
    return (
      <Flex vertical align="center" gap={"1rem"}>
        <Spin>
          <Typography>Loading...</Typography>
        </Spin>
      </Flex>
    );
  }
  //and if we have data
  if (isSuccess) {
    return (
      <Flex vertical gap={"1rem"}>
        {data?.pages.map((page) =>
          page?.data?.map((post, index) =>
            checkLastViewRef(index, page) ? (
              <div
                style={{
                  width: "100%",
                  backgroundColor: "blue",
                  height: "30rem",
                }}
                key={index}
                ref={ref}
              >
                <span>{post.postText}</span>
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  backgroundColor: "blue",
                  height: "30rem",
                }}
                key={post.id}
              >
                <span>{post.postText}</span>
              </div>
            )
          )
        )}
        {(isLoading || isFetchingNextPage || isFetching) && (
          <Flex vertical align="center" gap={"1rem"}>
            <Spin>
              <Typography>Loading...</Typography>
            </Spin>
          </Flex>
        )}
      </Flex>
    );
  }
};

export default Post;
