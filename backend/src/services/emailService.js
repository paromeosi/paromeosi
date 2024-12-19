const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const extractTagFromSubject = (subject) => {
  console.log("Subject ricevuto:", subject); // Debug log
  const match = subject.match(/tag:\s*([^\[\]]+)/i);
  if (match) {
    return match[1].trim().toLowerCase();
  }
  return null;
};

const saveAttachment = async (attachment) => {
  try {
    const timestamp = Date.now();
    const uniqueSuffix = Math.round(Math.random() * 1E9);
    const extension = path.extname(attachment.filename) || '.jpg';
    const filename = `photo-${timestamp}-${uniqueSuffix}${extension}`;
    const filepath = path.join(__dirname, '../../uploads', filename);

    // Assicurati che la directory uploads esista
    const uploadsDir = path.join(__dirname, '../../uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Salva il file
    await fs.writeFile(filepath, attachment.content);
    console.log(`File salvato: ${filename}`); // Debug log
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Errore nel salvare l\'allegato:', error);
    throw error;
  }
};

exports.processIncomingEmail = async (parsedMail) => {
  try {
    console.log("Processing email subject:", parsedMail.subject); // Debug log
    const tag = extractTagFromSubject(parsedMail.subject);

    if (!tag) {
      console.log('Tag non trovato nel subject:', parsedMail.subject);
      return null;
    }

    console.log("Tag estratto:", tag); // Debug log

    if (!parsedMail.attachments || parsedMail.attachments.length === 0) {
      console.log('Nessun allegato trovato');
      return null;
    }

    const results = [];
    for (const attachment of parsedMail.attachments) {
      if (attachment.contentType.startsWith('image/')) {
        const url = await saveAttachment(attachment);
        results.push({ url, tag });
      }
    }

    console.log(`Processate ${results.length} foto`); // Debug log
    return results;
  } catch (error) {
    console.error('Errore nel processare email:', error);
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