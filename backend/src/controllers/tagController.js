const Tag = require('../models/Tag');

const normalizeTag = (tag) => {
  // Rimuove spazi extra, converte in lowercase e capitalizza la prima lettera
  return tag.trim().toLowerCase().replace(/^\w/, c => c.toUpperCase());
};

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort('name');
    res.json(tags.map(tag => tag.name));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addTag = async (tagName) => {
  try {
    const normalizedTag = normalizeTag(tagName);
    const existingTag = await Tag.findOne({ 
      name: { $regex: new RegExp(`^${normalizedTag}$`, 'i') }
    });

    if (existingTag) {
      existingTag.count += 1;
      existingTag.lastUsed = new Date();
      await existingTag.save();
      return existingTag;
    }

    const newTag = new Tag({ name: normalizedTag });
    await newTag.save();
    return newTag;
  } catch (error) {
    console.error('Error adding tag:', error);
    throw error;
  }
};

exports.removeTag = async (tagName) => {
  try {
    const normalizedTag = normalizeTag(tagName);
    await Tag.findOneAndDelete({ 
      name: { $regex: new RegExp(`^${normalizedTag}$`, 'i') }
    });
  } catch (error) {
    console.error('Error removing tag:', error);
    throw error;
  }
};