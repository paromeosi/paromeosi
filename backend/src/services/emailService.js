const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const extractTagFromSubject = (subject) => {
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

const processImage = async (buffer, filename) => {
  console.log("Processing image:", filename);
  try {
    const processedImage = await sharp(buffer)
      .resize(2500, 2500, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 });
    console.log("Image processed successfully");
    return processedImage;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};

const saveAttachment = async (attachment) => {
  try {
    console.log("Saving attachment:", attachment.filename);
    const timestamp = Date.now();
    const uniqueSuffix = Math.round(Math.random() * 1E9);
    const extension = path.extname(attachment.filename) || '.jpg';
    const filename = `photo-${timestamp}-${uniqueSuffix}${extension}`;
    const filepath = path.join(__dirname, '../../uploads', filename);

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '../../uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    console.log("Uploads directory confirmed");

    // Process and save image
    const processedImage = await processImage(attachment.content, filename);
    await processedImage.toFile(filepath);
    console.log("File saved successfully to:", filepath);

    return `/uploads/${filename}`;
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
      if (attachment.contentType.startsWith('image/')) {
        console.log(`Processing image attachment: ${attachment.filename}`);
        try {
          const url = await saveAttachment(attachment);
          console.log("Image saved successfully:", url);
          results.push({ url, tag });
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