const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { 
                folder: "rental_cars",
                resource_type: "image",
                transformation: [
                    { width: 800, height: 600, crop: "limit" }, 
                    { quality: "auto" }
                ] 
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error); 
                    reject(new Error("Cloudinary upload failed: " + error.message));
                } else {
                    console.log("Cloudinary Upload Success:", result);
                    resolve(result.secure_url);
                }
            }
        );
        stream.end(fileBuffer);
    });
};

module.exports = { uploadImage };
