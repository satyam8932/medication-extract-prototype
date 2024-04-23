const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const imageToBase64 = require('./base64.js');
const gpt4Vision = require('./vision.js');

// Importing environment variables
dotenv.config();

// Create an Express app
const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Define storage for uploaded images using multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Defining a route to serve the HTML template
app.get('/', (req, res) => {
    // Serve the HTML file located in the 'public' directory
    res.json({ message: "This is the backend of Medics.js" });
});


// Route for handling image uploads using multer
app.post('/api/vision', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No image uploaded');
        }

        const imageBuffer = req.file.buffer;

        // Convert the image buffer to base64
        const base64Image = imageBuffer.toString('base64');

        // Pass the base64 image to the gpt4Vision function
        const result = await gpt4Vision(base64Image);
        console.log(result);
        res.json(result);
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send('Error uploading image');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
