import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) throw new Error('MONGODB_URI non impostata');
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(uri, { dbName: 'carognaleague' });
  console.log('[mongo] connesso a', uri); // log utile per Render/Netlify background
}