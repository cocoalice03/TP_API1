require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const DB = process.env.MONGODB_URI;

const https = require('https');
const fs = require('fs');

// Connexion à MongoDB avec options de stabilité et fallback local
const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    console.log('Connexion à MongoDB Atlas réussie !');
  } catch (err) {
    console.warn('Échec connexion Atlas, tentative sur MongoDB local...');
    try {
      await mongoose.connect('mongodb://localhost:27017/social-network-tp', {
        serverSelectionTimeoutMS: 2000
      });
      console.log('Connexion à MongoDB local réussie !');
    } catch (localErr) {
      console.error('Erreur CRITIQUE : Impossible de se connecter à MongoDB (Atlas ou Local).');
      process.exit(1);
    }
  }
};

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

connectDB().then(() => {
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Serveur HTTPS sécurisé en écoute sur le port ${PORT}`);
  });
});
