"use server";

import { cld } from "@/lib/cloudinary";

export const uploadFile = async (file, folder) => {
  try {
    const res = cld.v2.uploader.upload(
      file,
      {
        folder: `chat-wave/${folder}`,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.log("Error while uploading file");
        } else {
          console.log("File uploaded successfully");
          return result;
        }
      }
    );
    return res;
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to upload file",
    };
  }
};

export const deleteFile = async (publicId) => {
  try {
    const res = await cld.v2.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.log("Error while deleting file", publicId);
      } else {
        console.log("File deleted successfully", publicId);
        return;
      }
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to delete file",
    };
  }
};
