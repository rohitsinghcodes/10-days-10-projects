import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Url from './models/Url.js';
import { nanoid } from 'nanoid';
import cors from 'cors';

dotenv.config();

const app = express();
 
// Middleware
app.use(cors());
app.use(express.json()); // parses incoming JSON

// Connect to MongoDB 
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// ✅ POST route to shorten a URL
app.post('/api/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    const shortId = nanoid(6);
    const newUrl = await Url.create({ shortId, originalUrl });

    res.status(201).json({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ GET route to redirect
app.get('/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;
    const url = await Url.findOne({ shortId });

    if (url) {
      res.redirect(url.originalUrl);
    } else {
      res.status(404).send('URL not found');
    }
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).send('Server error');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
