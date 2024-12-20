require('dotenv').config();
const mongoose = require('mongoose');
const Photo = require('../src/models/Photo');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises;

async function regenerateThumbnails() {
  try {
    // Connetti al database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Prendi tutte le foto
    const photos = await Photo.find({});
    console.log(`Found ${photos.length} photos`);

    for (const photo of photos) {
      try {
        const originalPath = path.join(__dirname, '../', photo.url);
        const baseFilename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const thumbnailFilename = `${baseFilename}-thumb.jpg`;
        const thumbnailPath = path.join(__dirname, '../uploads', thumbnailFilename);

        // Leggi l'immagine originale
        const imageBuffer = await fs.readFile(originalPath);

        // Crea thumbnail
        await sharp(imageBuffer)
          .resize(300, 300, {
            fit: 'cover'
          })
          .jpeg({ quality: 70 })
          .toFile(thumbnailPath);

        // Aggiorna il record nel database
        photo.thumbnailUrl = `/uploads/${thumbnailFilename}`;
        await photo.save();

        console.log(`Rigenerata thumbnail per ${photo.url}`);
      } catch (err) {
        console.error(`Errore con la foto ${photo.url}:`, err);
      }
    }

    console.log('Processo completato!');
    process.exit(0);
  } catch (error) {
    console.error('Errore:', error);
    process.exit(1);
  }
}

regenerateThumbnails();