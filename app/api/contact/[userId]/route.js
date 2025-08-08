// app/api/contact/[userId]/route.js

import { NextResponse } from 'next/server'
import Conversation from '@/models/Conversation'
import { connectDB } from '@/lib/db'

export async function GET(req, context) {
  await connectDB()
  const { userId } = context.params

  let conversation = await Conversation.findOne({ userId }).lean()

  if (!conversation) {
    // Crée une nouvelle conversation vide si elle n'existe pas
    conversation = new Conversation({
      userId,
      messages: [],
      lastUpdated: new Date()
    })
    await conversation.save()

    return NextResponse.json({ messages: [] })
  }

  return NextResponse.json({ messages: conversation.messages })
}

export async function POST(req, context) {
  await connectDB()
  const { userId } = context.params
  const { sender, content } = await req.json()

  if (!userId || !sender || !content) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 })
  }

  let conversation = await Conversation.findOne({ userId })

  if (!conversation) {
    conversation = new Conversation({
      userId,
      messages: [],
    })
  }

  conversation.messages.push({ sender, content })
  conversation.lastUpdated = new Date()

  await conversation.save()

  return NextResponse.json({ success: true })
}

