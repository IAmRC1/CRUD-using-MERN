const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const config = require('config');

cloudinary.config({
  cloud_name: config.get('cloudName'),
  api_key: config.get('apiKey'),
  api_secret: config.get('apiSecret'),
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'vandebron-animals' },
});

const imageParser = multer({
  storage,
  limits: { fileSize: 2 * (1024 ** 2) }, // 2 mb
}).single('image');

module.exports = imageParser;
