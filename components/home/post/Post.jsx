"use client";
import { getMyFeedPosts, getPosts } from "@/actions/post";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Flex, Skeleton, Spin } from "antd";
import Typography from "antd/es/typography/Typography";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import SinglePost from "./SinglePost";

const Post = ({ id = "all" }) => {
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
    queryKey: ["posts", id],
    queryFn: ({ pageParam = "" }) =>
      id === "all" ? getMyFeedPosts(pageParam) : getPosts(pageParam, id),
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
      <Flex vertical gap={"1rem"}>
        <Skeleton
          avatar={{ size: "large" }}
          active
          style={{ width: "100%", height: "50%" }}
          paragraph={{ rows: 1 }}
        />
        <Skeleton.Image active style={{ height: "450px", width: "100%" }} />
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
              <div key={index} ref={ref}>
                <SinglePost data={post} queryId={id} />
              </div>
            ) : (
              <div key={post.id}>
                <SinglePost data={post} queryId={id} />
              </div>
            )
          )
        )}
        {(isLoading || isFetchingNextPage || isFetching) && (
          <Flex vertical gap={"1rem"}>
            <Skeleton
              avatar={{ size: "large" }}
              active
              style={{ width: "100%", height: "50%" }}
              paragraph={{ rows: 1 }}
            />
            <Skeleton.Image active style={{ height: "450px", width: "100%" }} />
          </Flex>
        )}
      </Flex>
    );
  }
};

export default Post;
