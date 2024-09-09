export const getUrlKey = (resourceName: string) => {
  switch (resourceName) {
    case "files":
      return "url";
    default:
      return "image_url";
  }
};
