export const fetchVideoDetails = async (url) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: "Sample Video Title - Backend Integration Pending",
        thumbnail: "https://via.placeholder.com/800x450/1a1a1a/ffffff?text=Video+Thumbnail",
        duration: "10:24"
      });
    }, 1500);
  });
};