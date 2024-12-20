const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const Photo = require('../models/Photo');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const saveAttachment = async (attachment, filename) => {
  const filepath = path.join(__dirname, '../../uploads', filename);
  await fs.writeFile(filepath, attachment.content);
  return `/uploads/${filename}`;
};

exports.processIncomingEmail = async (email) => {
  try {
    // Estrai il tag dall'oggetto
    const tagMatch = email.subject.match(/tag:\s*\[(.*?)\]/i);
    const tag = tagMatch ? tagMatch[1].toLowerCase().trim() : null;

    if (!tag) {
      console.log('No tag found in subject:', email.subject);
      return;
    }

    const attachments = email.attachments || [];
    const savedPhotos = [];

    for (const attachment of attachments) {
      if (attachment.contentType.startsWith('image/')) {
        const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(attachment.filename)}`;
        const url = await saveAttachment(attachment, filename);
        savedPhotos.push({ url, tag });
      }
    }

    return savedPhotos;
  } catch (error) {
    console.error('Error processing email:', error);
    throw error;
  }
};

exports.sendSubmissionEmail = async (userEmail, file) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Nuova foto da approvare',
      text: `Nuova foto ricevuta da: ${userEmail}`,
      attachments: [{
        filename: file.originalname,
        path: file.path
      }]
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};