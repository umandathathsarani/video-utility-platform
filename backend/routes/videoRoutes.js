const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.post('/extract', videoController.getVideoDetails);
router.get('/download', videoController.downloadMedia);

module.exports = router;