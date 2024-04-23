const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs').promises;
const imageToBase64 = require('./base64.js');
const gpt4Vision = require('./vision.js');

// Importing environment variables
dotenv.config();

// Create an Express app
const app = express();

// Enable CORS
app.use(cors());

// Defining a folder for storing uploaded images
const imageUploadsFolder = path.resolve(__dirname, 'image_uploads');

// Create the image uploads folder if it doesn't exist
fs.mkdir(imageUploadsFolder, { recursive: true })
    .catch(error => {
        if (error.code !== 'EEXIST') {
            console.error('Error creating image uploads folder:', error);
        }
    });

// Configure multer to store uploaded images in the image uploads folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageUploadsFolder);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// Initialize multer with the configured storage
const upload = multer({ storage: storage });

// Definng a route to serve the HTML template
app.get('/', (req, res) => {
    // Serve the HTML file located in the 'public' directory
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for handling image uploads
app.post('/api/vision', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No image uploaded');
        }

        // Get the path of the uploaded image
        const imagePath = req.file.path;

        // Convert the uploaded image to base64
        imageToBase64(imagePath).then(base64Image => {
            // Pass the base64 image to the gpt4Vision function
            gpt4Vision(base64Image).then(result => {
                console.log(result);
                res.send(result);
            });
        });
        // res.send('Image uploaded successfully');

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








// Testing
// imageToBase64("medico.jpg").then(base64Image => {
//   gpt4Vision(base64Image).then(result => {
//     console.log(result);
//   })
// })
