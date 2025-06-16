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
app.use(express.json());

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ POST: Create or reuse short URL
app.post('/api/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    // Check if URL already exists
    const existing = await Url.findOne({ originalUrl });
    if (existing) {
      return res.status(200).json({ shortUrl: `${process.env.BASE_URL}/${existing.shortId}` });
    }

    const shortId = nanoid(6);
    const newUrl = await Url.create({ shortId, originalUrl });

    res.status(201).json({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
  } catch (error) {
    console.error('❌ Error shortening URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ GET: Redirect short URL to original
app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  const url = await Url.findOne({ shortId });

  if (!url) return res.status(404).send('❌ URL not found');

  const original = url.originalUrl;

  // Serve base64 image on a page
  if (original.startsWith('data:image')) {
    return res.send(`
      <html>
        <body style="text-align:center; margin-top:50px;">
          <img src="${original}" alt="Shortened Image" />
        </body>
      </html>
    `);
  }

  // If it's a valid external URL
  if (original.startsWith('http')) {
    return res.redirect(original);
  }

  res.status(400).send('⚠️ Unsupported URL type');
});


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
