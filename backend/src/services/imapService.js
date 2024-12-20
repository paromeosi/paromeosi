const Imap = require('imap');
const { simpleParser } = require('mailparser');
const { processIncomingEmail } = require('./services/emailService');
const Photo = require('./models/Photo');

const imapConfig = {
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASS,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

const imap = new Imap(imapConfig);

function openInbox(cb) {
  imap.openBox('INBOX', false, cb);
}

const startEmailListener = () => {
  imap.on('ready', () => {
    openInbox((err, box) => {
      if (err) throw err;

      imap.on('mail', async (numNew) => {
        console.log(`Ricevute ${numNew} nuove email`);
        
        const fetch = imap.seq.fetch(`${box.messages.total}:*`, {
          bodies: '',
          struct: true
        });

        fetch.on('message', (msg) => {
          msg.on('body', async (stream) => {
            try {
              const parsed = await simpleParser(stream);
              const photos = await processIncomingEmail(parsed);
              
              if (photos && photos.length > 0) {
                for (const photo of photos) {
                  const newPhoto = new Photo({
                    url: photo.url,
                    tag: photo.tag,
                    approved: true
                  });
                  await newPhoto.save();
                }
              }
            } catch (error) {
              console.error('Error processing message:', error);
            }
          });
        });
      });
    });
  });

  imap.on('error', (err) => {
    console.error('IMAP error:', err);
  });

  imap.connect();
};

module.exports = { startEmailListener };