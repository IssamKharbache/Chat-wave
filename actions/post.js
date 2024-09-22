"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { uploadFile } from "./uploadFile";
import { checkPostForTrends } from "@/utils";
import { NEXT_QUERY_PARAM_PREFIX } from "next/dist/lib/constants";
import { getAllFollowersAndFollowing } from "./user";

//create post function
export const createPost = async (post) => {
  try {
    const { postText, media } = post;
    const user = await currentUser();
    let cld_id;
    let asset_url;

    if (media) {
      const res = await uploadFile(media, `/posts/${user?.id}`);
      const { public_id, secure_url } = res;
      cld_id = public_id;
      asset_url = secure_url;
    }

    const newPost = await db.post.create({
      data: {
        postText,
        media: asset_url,
        cld_id,
        author: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    const trends = checkPostForTrends(postText);
    if (trends.length > 0) {
      createTrends(trends, newPost.id);
    }
    return {
      data: newPost,
    };
  } catch (error) {
    console.log(error?.message);
    throw new Error("Failed creating a new post");
  }
};

//
export const getPosts = async (lastCursor, id) => {
  try {
    // const { id: userId } = await currentUser();
    const take = 5;
    const where = id !== "all" ? { author: { id } } : {};
    const posts = await db.post.findMany({
      include: {
        author: true,
        likes: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
      where,
      take,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      orderBy: {
        createdAt: "desc",
      },
    });

    if (posts.length === 0) {
      return {
        data: [],
        metaData: {
          lastCursor: null,
          hasMore: false,
        },
      };
    }
    const lastPostInResults = posts[posts.length - 1];
    const cursor = lastPostInResults?.id;

    const morePosts = await db.post.findMany({
      where,
      take,
      skip: 1,
      cursor: {
        id: cursor,
      },
    });
    return {
      data: posts,
      metaData: {
        lastCursor: cursor,
        hasMore: morePosts.length > 0,
      },
    };
  } catch (e) {
    console.log(e);
    throw Error("Failed to fetch posts");
  }
};

//get feed posts
export const getMyFeedPosts = async (lastCursor) => {
  try {
    const { id } = await currentUser();
    const { followers, following } = await getAllFollowersAndFollowing(id);
    const followingIds = following.map((person) => person.followingId);

    //combine the list of ids and include yourt own id
    const userIds = [...new Set([...followingIds, id])];

    const where = {
      author: {
        id: {
          in: userIds,
        },
      },
    };
    const take = 5;
    const posts = await db.post.findMany({
      include: {
        author: true,
        likes: true,
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      where,
      take,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      orderBy: {
        createdAt: "desc",
      },
    });
    if (posts.length === 0) {
      return {
        data: [],
        metaData: {
          lastCursor: null,
          hasMore: false,
        },
      };
    }
    const lastPostInResult = posts[posts.length - 1];
    const cursor = lastPostInResult.id;
    const morePosts = await db.post.findMany({
      where,
      take,
      skip: 1,
      cursor: {
        id: cursor,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: posts,
      metaData: {
        lastCursor: cursor,
        hasMore: morePosts.length > 0,
      },
    };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get posts");
  }
};
//like and unlike post
export const updatePostLike = async (postId, actionType) => {
  try {
    const { id: userId } = await currentUser();

    //find the post
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        likes: true,
      },
    });
    if (!post) {
      return {
        error: "Post not found",
      };
    }
    //check if the user already liked the post
    const liked = post.likes.find((like) => like.authorId == userId);
    //if the user already liked the post, unlike it
    if (liked) {
      if (actionType === "like") {
        return {
          data: post,
        };
      }
      //otherwise
      else {
        await db.like.delete({
          where: {
            id: liked.id,
          },
        });
        console.log("Like deleted");
      }
    } else {
      if (actionType === "unlike") {
        return {
          data: post,
        };
      } else {
        //if user hasn't liked the post, like it
        await db.like.create({
          data: {
            post: {
              connect: {
                id: postId,
              },
            },
            author: {
              connect: {
                id: userId,
              },
            },
          },
        });
        console.log("Post liked");
      }
    }
    const updatedPost = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        likes: true,
      },
    });
    return {
      data: updatedPost,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update post like state");
  }
};

//make a comment
export const addComment = async (postId, comment) => {
  try {
    const { id: userId } = await currentUser();

    const newComment = await db.comment.create({
      data: {
        comment,
        post: {
          connect: {
            id: postId,
          },
        },
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
    console.log("Comment created", newComment);
    return {
      data: newComment,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add a comment");
  }
};
//create trends
export const createTrends = async (trends, postId) => {
  try {
    const newTrends = await db.trend.createMany({
      data: trends.map((trend) => ({
        name: trend,
        postId: postId,
      })),
    });
    return {
      data: newTrends,
    };
  } catch (error) {}
};

//get trends
export const getPopularTrends = async () => {
  try {
    const trends = await db.trend.groupBy({
      by: ["name"],
      _count: {
        name: true,
      },
      orderBy: {
        _count: {
          name: "desc",
        },
      },
      take: 3,
    });
    return {
      data: trends,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get trends");
  }
};
