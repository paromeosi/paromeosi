const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');

router.get('/', photoController.getAllPhotos);
router.get('/tags', photoController.getActiveTags);
router.get('/tag/:tag', photoController.getPhotosByTag);

module.exports = router;