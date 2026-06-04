const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.post('/extract', videoController.getVideoDetails);

module.exports = router;