const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { sendSubmissionEmail } = require('../services/emailService');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato file non supportato. Usa JPG, PNG o GIF.'));
    }
  }
});

router.post('/submit', upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.body.email) {
      return res.status(400).json({ message: 'Manca il file o l\'email' });
    }

    await sendSubmissionEmail(req.body.email, req.file);
    res.json({ message: 'Foto inviata con successo!' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Errore durante l\'upload' });
  }
});

module.exports = router;