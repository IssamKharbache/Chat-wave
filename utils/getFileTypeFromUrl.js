export const getFileTypeFromUrl = (url) => {
  if (url === null || url === undefined) return "Unknown type";
  const extension = url.split(".").pop();
  switch (extension) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return "image";
    case "mp4":
    case "mov":
    case "avi":
      return "video";
    default:
      return "Unknown type";
  }
};
