const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 30 * 1024 * 1024 // 30MB limite
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo le immagini sono permesse'));
    }
  }
});

router.post('/upload', upload.single('image'), adminController.uploadPhoto);

module.exports = router;