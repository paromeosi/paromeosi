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

    // Genera nome file unico
    const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
    const filepath = path.join(__dirname, '../../uploads', filename);
    console.log('File will be saved as:', filename);

    try {
      await sharp(req.file.buffer)
        .resize(2500, 2500, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 85 })
        .toFile(filepath);
      console.log('Image processed and saved');
    } catch (err) {
      console.error('Error processing image:', err);
      throw err;
    }

    const photo = new Photo({
      url: `/uploads/${filename}`,
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