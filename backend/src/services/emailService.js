const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const Photo = require('../models/Photo');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const extractTagFromSubject = (subject = '') => {
  console.log("Processing email subject:", subject);
  const match = subject.match(/tag:\s*([^\[\]]+)/i);
  if (match) {
    const tag = match[1].trim().toLowerCase();
    console.log("Extracted tag:", tag);
    return tag;
  }
  console.log("No tag found in subject");
  return null;
};

const saveAttachment = async (attachment) => {
  try {
    console.log("Saving attachment:", attachment.filename);
    const baseFilename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullImageFilename = `${baseFilename}.jpg`;
    const thumbnailFilename = `${baseFilename}-thumb.jpg`;
    
    const fullImagePath = path.join(__dirname, '../../uploads', fullImageFilename);
    const thumbnailPath = path.join(__dirname, '../../uploads', thumbnailFilename);

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '../../uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    console.log("Uploads directory confirmed");

    // Process buffer
    const buffer = Buffer.isBuffer(attachment.content) 
      ? attachment.content 
      : Buffer.from(attachment.content);

    // Save full size image
    await sharp(buffer)
      .resize(2500, 2500, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toFile(fullImagePath);

    // Save thumbnail
    await sharp(buffer)
      .resize(300, 300, {
        fit: 'cover'
      })
      .jpeg({ quality: 70 })
      .toFile(thumbnailPath);

    console.log("Files saved successfully");
    return {
      url: `/uploads/${fullImageFilename}`,
      thumbnailUrl: `/uploads/${thumbnailFilename}`
    };
  } catch (error) {
    console.error("Error saving attachment:", error);
    throw error;
  }
};

exports.processIncomingEmail = async (parsedMail) => {
  try {
    console.log("Processing new email:", parsedMail.subject);
    const tag = extractTagFromSubject(parsedMail.subject);

    if (!tag) {
      console.log('No tag found, skipping email');
      return null;
    }

    if (!parsedMail.attachments || parsedMail.attachments.length === 0) {
      console.log('No attachments found');
      return null;
    }

    console.log(`Processing ${parsedMail.attachments.length} attachments`);
    const results = [];
    
    for (const attachment of parsedMail.attachments) {
      if (attachment.contentType && attachment.contentType.startsWith('image/')) {
        console.log(`Processing image attachment: ${attachment.filename}`);
        try {
          const { url, thumbnailUrl } = await saveAttachment(attachment);
          
          const photo = new Photo({
            url,
            thumbnailUrl,
            tag,
            sourceEmail: parsedMail.from.text,
            approved: true
          });
          
          await photo.save();
          console.log("Photo saved to database:", url);
          results.push(photo);
          
        } catch (err) {
          console.error(`Error processing attachment ${attachment.filename}:`, err);
        }
      } else {
        console.log(`Skipping non-image attachment: ${attachment.filename}`);
      }
    }

    return results;
  } catch (error) {
    console.error('Error in processIncomingEmail:', error);
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