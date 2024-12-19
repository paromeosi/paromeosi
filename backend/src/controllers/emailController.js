const multer = require('multer');
const { processIncomingEmail, sendSubmissionEmail } = require('../services/emailService');

// Configura multer per gestire gli upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limite di 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo le immagini sono permesse!'));
    }
  },
});

exports.handleSubmission = [
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Nessuna immagine caricata' });
      }

      await sendSubmissionEmail(req.body.email, req.file);
      res.json({ message: 'Submission received successfully' });
    } catch (error) {
      console.error('Error handling submission:', error);
      res.status(500).json({ message: 'Error processing submission' });
    }
  }
];

exports.handleIncomingEmail = async (req, res) => {
  try {
    const result = await processIncomingEmail(req.body);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error handling incoming email:', error);
    res.status(500).json({ message: 'Error processing email' });
  }
};