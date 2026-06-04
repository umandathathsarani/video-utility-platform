const youtubedl = require('youtube-dl-exec');

exports.getVideoDetails = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const videoInfo = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true
    });

    const formatDuration = (seconds) => {
      if (!seconds) return "N/A";
      return new Date(seconds * 1000).toISOString().slice(11, 19);
    };

    res.json({
      title: videoInfo.title,
      thumbnail: videoInfo.thumbnail,
      duration: formatDuration(videoInfo.duration)
    });
  } catch (error) {
    console.error("Extraction Error:", error.message);
    res.status(500).json({ error: "Failed to extract video details" });
  }
};

exports.downloadMedia = (req, res) => {
  const { url, type } = req.query;
  if (!url) return res.status(400).send("URL is required");

  const isAudio = type === 'mp3';
  const options = {
    output: '-',
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    format: isAudio ? 'bestaudio/best' : 'best'
  };

  if (isAudio) {
    options.extractAudio = true;
    options.audioFormat = 'mp3';
  }

  res.setHeader('Content-Disposition', `attachment; filename="download.${isAudio ? 'mp3' : 'mp4'}"`);
  res.setHeader('Content-Type', isAudio ? 'audio/mpeg' : 'video/mp4');

  const subprocess = youtubedl.exec(url, options);
  
  subprocess.stdout.pipe(res);

  subprocess.on('error', (error) => {
    console.error("Download Error:", error.message);
    if (!res.headersSent) res.status(500).send("Download failed");
  });
};