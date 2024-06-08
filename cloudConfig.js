const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_API_KEY, // Corrected typo
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wonderlust_Dev',
        allowedFormats: ["jpg", "png", "jpeg", "webp"], // Corrected typo
    },
});

module.exports = {
    cloudinary,
    storage,
};
