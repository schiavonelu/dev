import mongoose from 'mongoose';
const ArticleSchema = new mongoose.Schema({
title: String,
slug: { type: String, unique: true },
cover: String,
excerpt: String,
body: String,
tags: [String],
author: String,
published: { type: Boolean, default: false },
publishedAt: Date,
createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Article', ArticleSchema);