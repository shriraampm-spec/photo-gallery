
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/photos', require('./routes/photoRoutes'));

app.use((error, _req, res, next) => {
    if (!error) {
        next();
        return;
    }

    if (error.message === 'Only image uploads are allowed.' || error.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({
            message: error.code === 'LIMIT_FILE_SIZE' ? 'Image size must be 5MB or less.' : error.message,
        });
        return;
    }

    res.status(500).json({ message: error.message || 'Server error' });
});

// Export the app object for testing
if (require.main === module) {
    connectDB();
    // If the file is run directly, start the server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }


module.exports = app
