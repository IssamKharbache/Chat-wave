"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { uploadFile } from "./uploadFile";

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
    console.log(newPost);
    return {
      data: newPost,
    };
  } catch (error) {
    console.log(e?.message);
    throw new Error("Failed creating a new post");
  }
};

export const getMyFeedPosts = async (lastCursor) => {
  try {
    const take = 5;
    const posts = await db.post.findMany({
      include: {
        author: true,
        likes: true,
        comments: true,
      },
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
    console.log("Update post", updatedPost);
    return {
      data: updatedPost,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update post like state");
  }
};
