import mongoose from 'mongoose';

export async function connectDB(uri, dbName = process.env.MONGODB_DB || 'carognaleague') {
  if (!uri) throw new Error('MONGODB_URI non impostata');
  if (mongoose.connection.readyState >= 1) return;

  const options = dbName ? { dbName } : {};
  await mongoose.connect(uri, options);
  console.log(`[mongo] connesso a ${uri} (db: ${dbName || 'predefinito da URI'})`); // log utile per Render/Netlify background
}
