exports.getVideoDetails = (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  res.json({
    title: "Sample Video Title - Connected to Node.js Backend",
    thumbnail: "https://via.placeholder.com/800x450/1a1a1a/ffffff?text=Live+From+Backend",
    duration: "12:45"
  });
};