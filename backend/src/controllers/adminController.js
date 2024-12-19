const Photo = require('../models/Photo');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises;

exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nessun file caricato' });
    }

    const tag = req.body.tag ? req.body.tag.toLowerCase().trim() : null;
    if (!tag) {
      return res.status(400).json({ message: 'Tag richiesto' });
    }

    // Genera nome file unico
    const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
    const filepath = path.join(__dirname, '../../uploads', filename);

    // Ridimensiona e salva l'immagine
    await sharp(req.file.buffer)
      .resize(2500, 2500, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toFile(filepath);

    // Salva nel database
    const photo = new Photo({
      url: `/uploads/${filename}`,
      tag: tag,
      sourceEmail: 'admin-upload',
      approved: true
    });

    await photo.save();

    res.json({ 
      message: 'Foto caricata con successo',
      photo: photo
    });

  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ message: 'Errore durante il caricamento' });
  }
};