const Photo = require('../models/Photo');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises;

exports.uploadPhoto = async (req, res) => {
  try {
    console.log('Upload request received');
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: 'Nessun file caricato' });
    }
    console.log('File size:', req.file.size);

    const tag = req.body.tag ? req.body.tag.toLowerCase().trim() : null;
    if (!tag) {
      console.log('No tag provided');
      return res.status(400).json({ message: 'Tag richiesto' });
    }
    console.log('Tag:', tag);

    // Genera nomi file unici
    const baseFilename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullImageFilename = `${baseFilename}.jpg`;
    const thumbnailFilename = `${baseFilename}-thumb.jpg`;
    
    const fullImagePath = path.join(__dirname, '../../uploads', fullImageFilename);
    const thumbnailPath = path.join(__dirname, '../../uploads', thumbnailFilename);

    try {
      // Salva versione grande
      await sharp(req.file.buffer)
        .resize(2500, 2500, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 85 })
        .toFile(fullImagePath);

      // Salva thumbnail
      await sharp(req.file.buffer)
        .resize(300, 300, {
          fit: 'cover'
        })
        .jpeg({ quality: 70 })
        .toFile(thumbnailPath);

      console.log('Images processed and saved');
    } catch (err) {
      console.error('Error processing image:', err);
      throw err;
    }

    const photo = new Photo({
      url: `/uploads/${fullImageFilename}`,
      thumbnailUrl: `/uploads/${thumbnailFilename}`,
      tag: tag,
      sourceEmail: 'admin-upload',
      approved: true
    });

    await photo.save();
    console.log('Photo saved to database');

    res.json({ 
      message: 'Foto caricata con successo',
      photo: photo
    });

  } catch (error) {
    console.error('Error in uploadPhoto:', error);
    res.status(500).json({ message: 'Errore durante il caricamento' });
  }
};