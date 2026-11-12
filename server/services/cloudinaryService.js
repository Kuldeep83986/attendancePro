const cloudinary = require('../config/cloudinary');

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {string} folder - Cloudinary folder path (e.g., 'attendancepro/punch-in')
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const base64 = fileBuffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64}`;

    cloudinary.uploader.upload(
      dataUri,
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve(result.secure_url);
        }
      }
    );
  });
};

module.exports = { uploadToCloudinary };

