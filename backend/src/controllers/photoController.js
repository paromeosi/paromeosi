const Photo = require('../models/Photo');

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

// Aggiungiamo questa nuova funzione per ottenere i tag attivi
exports.getActiveTags = async (req, res) => {
  try {
    // Trova tutti i tag unici dalle foto approvate
    const tags = await Photo.distinct('tag', { approved: true });
    const sortedTags = tags.sort((a, b) => a.localeCompare(b));
    res.json(sortedTags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};