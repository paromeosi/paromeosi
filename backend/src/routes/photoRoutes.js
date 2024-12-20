const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');

router.get('/', photoController.getAllPhotos);
router.get('/tags', photoController.getAllTags);
router.get('/tag/:tag', photoController.getPhotosByTag);
router.delete('/:id', photoController.deletePhoto);

module.exports = router;