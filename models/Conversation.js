// models/Conversation.js

import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['admin', 'user'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
})

const ConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  messages: [MessageSchema],
  lastUpdated: { type: Date, default: Date.now }
})

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema)

