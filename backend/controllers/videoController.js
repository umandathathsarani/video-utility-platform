const youtubedl = require('youtube-dl-exec');

exports.getVideoDetails = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const videoInfo = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36']
    });

    const formatDuration = (seconds) => {
      return new Date(seconds * 1000).toISOString().slice(11, 19);
    };

    res.json({
      title: videoInfo.title,
      thumbnail: videoInfo.thumbnail,
      duration: formatDuration(videoInfo.duration)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to extract video details" });
  }
};