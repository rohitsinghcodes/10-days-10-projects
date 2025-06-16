import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  shortId: String,
  originalUrl: String,
});

const Url = mongoose.model('Url', urlSchema);

export default Url;
