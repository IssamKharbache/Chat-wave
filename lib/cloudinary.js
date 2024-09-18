import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: "process.e",
  api_key: "",
  api_secret: "",
});

export const cld = globalThis.cloudinary || cloudinary;

if (process.env.NODE_ENV === "development") globalThis.cloudinary = cld;
