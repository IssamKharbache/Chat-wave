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
