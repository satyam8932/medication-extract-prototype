const fs = require('fs').promises;

// Function to convert image to base64
const imageToBase64 = async (imagePath) => {
    try {
        // Read the image file
        const imageBuffer = await fs.readFile(imagePath);

        // Convert image buffer to base64 string
        const base64String = imageBuffer.toString('base64');

        return base64String;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

module.exports = imageToBase64;
