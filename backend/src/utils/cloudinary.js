import "dotenv/config";
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs/promises';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});


const uploadOnCloudinary = async (localFilePath, folder) => {
    try {
        if (!localFilePath) {
            throw new Error('Local file path is required');
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            ...(folder ? { folder } : {})
        });

        console.log('Upload successful:', response);

        await fs.unlink(localFilePath);

        return response;

    } catch (error) {
        
        if (localFilePath) {
            try {
                await fs.unlink(localFilePath);
            } catch (err) {
                console.log("File delete failed:", err.message);
            }
        }

        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

const getPublicIdFromUrl = (url) => {
    if (!url) {
        return null;
    }

    const urlParts = url.split('/upload/');
    if (urlParts.length < 2) {
        return null;
    }

    const filePath = urlParts[1].replace(/^v\d+\//, '');
    return filePath.replace(/\.[^/.]+$/, '');
};

const deleteFromCloudinary = async (fileUrl) => {
    try {
        const publicId = getPublicIdFromUrl(fileUrl);

        if (!publicId) {
            return null;
        }

        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

export default uploadOnCloudinary;
export { deleteFromCloudinary };
