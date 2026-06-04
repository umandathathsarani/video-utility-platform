const youtubedl = require('youtube-dl-exec');

const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return 'Size Unknown';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
};

exports.getVideoDetails = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const videoInfo = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
    });

    const formatDuration = (seconds) => {
      if (!seconds) return "N/A";
      return new Date(seconds * 1000).toISOString().slice(11, 19);
    };

    const availableFormats = [];
    if (videoInfo.formats) {
      const audioFormats = videoInfo.formats.filter(f => f.vcodec === 'none' && f.acodec !== 'none');
      const bestAudio = audioFormats.length > 0 
        ? audioFormats.sort((a, b) => (b.filesize || 0) - (a.filesize || 0))[0] 
        : null;

      const videoFormats = videoInfo.formats.filter(f => f.vcodec !== 'none' && f.height);

      const seenHeights = new Set();
      videoFormats.sort((a, b) => b.height - a.height).forEach(f => {
        if (!seenHeights.has(f.height)) {
          seenHeights.add(f.height);
          
          const hasAudio = f.acodec !== 'none';

          const downloadId = hasAudio ? f.format_id : (bestAudio ? `${f.format_id}+${bestAudio.format_id}` : f.format_id);

          availableFormats.push({
            id: downloadId,
            label: `${f.height}p Video${hasAudio ? '' : ' (HQ Merge)'}`,
            size: formatBytes(f.filesize || f.filesize_approx || 0),
            type: 'video'
          });
        }
      });

      if (bestAudio) {
        availableFormats.push({
          id: bestAudio.format_id,
          label: `Audio Only (MP3)`,
          size: formatBytes(bestAudio.filesize || bestAudio.filesize_approx || 0),
          type: 'audio'
        });
      }
    }

    res.json({
      title: videoInfo.title,
      thumbnail: videoInfo.thumbnail,
      duration: formatDuration(videoInfo.duration),
      formats: availableFormats
    });
  } catch (error) {
    console.error("Extraction Error:", error.message);
    res.status(500).json({ error: "Failed to extract video details" });
  }
};

exports.downloadMedia = (req, res) => {
  const { url, type, formatId } = req.query;
  if (!url) return res.status(400).send("URL is required");

  const isAudio = type === 'audio';
  
  const options = {
    output: '-',
    noCheckCertificates: true,
    noWarnings: true,
    format: formatId || (isAudio ? 'bestaudio/best' : 'best')
  };

  res.setHeader('Content-Disposition', `attachment; filename="download.${isAudio ? 'mp3' : 'mp4'}"`);
  res.setHeader('Content-Type', isAudio ? 'audio/mpeg' : 'video/mp4');

  const subprocess = youtubedl.exec(url, options);
  
  subprocess.stdout.pipe(res);

  subprocess.on('error', (error) => {
    console.error("Download Error:", error.message);
    if (!res.headersSent) res.status(500).send("Download failed");
  });
};

exports.getPlaylistUrls = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const playlistInfo = await youtubedl(url, {
      dumpSingleJson: true,
      flatPlaylist: true,
      noCheckCertificates: true,
      noWarnings: true,
    });

    if (!playlistInfo.entries || playlistInfo.entries.length === 0) {
      return res.status(400).json({ error: "No videos found in this playlist." });
    }

    const urls = playlistInfo.entries.map(entry => {
      return entry.url || `https://www.youtube.com/watch?v=${entry.id}`;
    });

    res.json({ title: playlistInfo.title, urls });
  } catch (error) {
    console.error("Playlist Extraction Error:", error.message);
    res.status(500).json({ error: "Failed to extract playlist details" });
  }
};