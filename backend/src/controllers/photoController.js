const Photo = require('../models/Photo');
const fs = require('fs').promises;
const path = require('path');

exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ approved: true })
      .sort('-createdAt')
      .lean();
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPhotosByTag = async (req, res) => {
  try {
    const photos = await Photo.find({ 
      tag: req.params.tag.toLowerCase(),
      approved: true 
    })
    .sort('-createdAt')
    .lean();
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Photo.distinct('tag', { approved: true });
    const sortedTags = tags.sort((a, b) => a.localeCompare(b));
    res.json(sortedTags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Foto non trovata' });
    }

    // Elimina il file fisico
    const filePath = path.join(__dirname, '../../', photo.url);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    // Elimina il record dal database
    await Photo.deleteOne({ _id: req.params.id });

    res.json({ message: 'Foto eliminata con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};