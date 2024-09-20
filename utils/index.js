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

export const updateQueryCacheLikes = (
  postLikes,
  postId,
  userId,
  actionType
) => {
  if (actionType === "like") {
    return [...postLikes, { authorId: userId, postId }];
  } else {
    return postLikes.filter((like) => {
      like.authorId !== userId;
    });
  }
};

export const checkPostForTrends = (postText) => {
  //split post text into words
  const firstSplit = postText
    .trim()
    .split(/\s+/)
    .filter((word) => word.startsWith("#"))
    .map((word) => word.toLowerCase());

  let result = firstSplit;
  // check if there are any words that have multiple hashtags
  firstSplit.map((word) => {
    const secondSplit = word.split("#");
    if (secondSplit.length > 1) {
      result = [...result, ...secondSplit.slice(1, secondSplit.length)].filter(
        (el) => el !== word
      );
    }
  });
  // if array contains duplicates, remove them
  result = [...new Set(result)];
  return result;
};
