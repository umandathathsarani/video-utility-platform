const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.post('/extract', videoController.getVideoDetails);

router.get('/download', videoController.downloadMedia);

router.post('/playlist', videoController.getPlaylistUrls);

module.exports = router;