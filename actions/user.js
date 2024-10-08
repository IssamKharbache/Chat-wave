"use server";

import { db } from "@/lib/db";
import { deleteFile, uploadFile } from "./uploadFile";
import { currentUser } from "@clerk/nextjs";

//create user
export const createUser = async (user) => {
  const { id, first_name, last_name, email_address, image_url, username } =
    user;

  try {
    const userExists = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (userExists) {
      // update user
      updateUser(user);
      return;
    }
    await db.user.create({
      data: {
        id,
        first_name,
        last_name,
        email_address,
        image_url,
        username,
      },
    });
  } catch (error) {
    console.log(error);
    return { error: "Failed to create user to data base" };
  }
};
//update user
export const updateUser = async (user) => {
  const { id, first_name, last_name, email_address, image_url, username } =
    user;
  try {
    await db.user.update({
      where: {
        id,
      },
      data: {
        first_name,
        last_name,
        email_address,
        image_url,
        username,
      },
    });
    console.log("User updated successfully");
  } catch (error) {
    console.log(error);
    return { error: "Failed to update user to data base" };
  }
};
//delete user
export const deleteUser = async (id) => {
  try {
    await db.user.delete({
      where: {
        id,
      },
    });
    console.log("User deleted successfully");
  } catch (error) {
    console.log(error);
    return { error: "Failed to delete user to data base" };
  }
};
//get user
export const getUser = async (id) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email_address: true,
        image_url: true,
        username: true,
        banner_url: true,
        banner_id: true,
      },
    });
    if (!user) {
      return { error: "User not found" };
    }
    return {
      data: user,
    };
  } catch (error) {
    console.log(error);
    return { error: "Failed to get user from data base" };
  }
};

//update user profile banner
export const updateBanner = async (params) => {
  const { id, banner, prevBannerId } = params;
  try {
    let banner_id;
    let banner_url;
    if (banner) {
      const res = await uploadFile(banner, `/users/${id}`);
      const { public_id, secure_url } = res;
      banner_id = public_id;
      banner_url = secure_url;
    }
    //delete previous banner
    if (prevBannerId) {
      await deleteFile(prevBannerId);
    }
    await db.user.update({
      where: {
        id,
      },
      data: {
        banner_id,
        banner_url,
      },
    });
    console.log("Banner updated successfully");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//get all followers and following
export const getAllFollowersAndFollowing = async (id) => {
  try {
    const followers = await db.follow.findMany({
      where: {
        followingId: id,
      },
      include: {
        follower: true,
      },
    });
    const following = await db.follow.findMany({
      where: {
        followerId: id,
      },
      include: {
        following: true,
      },
    });
    return {
      followers,
      following,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//get follow suggestions

export const getFollowSuggestions = async () => {
  try {
    const loggedInUser = await currentUser();

    const following = await db.follow.findMany({
      where: {
        followerId: loggedInUser.id,
      },
    });
    //get the ids that the logged in user is following
    const followingIds = following.map((following) => following.followingId);
    const suggestions = await db.user.findMany({
      where: {
        AND: [
          { id: { not: loggedInUser?.id } }, //exclude the logged in user
          { id: { notIn: followingIds } }, // exclude the users that the logged in user is following
        ],
      },
    });

    return suggestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateFollow = async (params) => {
  try {
    const { id, type } = params;
    //type can be "follow or unfollow"
    const loggedInUser = await currentUser();

    if (type === "follow") {
      await db.follow.create({
        data: {
          follower: {
            connect: {
              id: loggedInUser?.id,
            },
          },
          following: {
            connect: {
              id,
            },
          },
        },
      });
      console.log("followed");
    } else if (type === "unfollow") {
      await db.follow.deleteMany({
        where: {
          followerId: loggedInUser?.id,
          followingId: id,
        },
      });
      console.log("unfollowed");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
