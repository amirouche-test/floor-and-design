//app/api/contact/users/route.js

import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Conversation from '@/models/Conversation'

export async function GET() {
  await connectDB()

  try {
    // 🔹 Récupérer les utilisateurs (sans les admins)
    const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 }).lean()

    // 🔹 Récupérer les conversations avec lastUpdated
    const conversations = await Conversation.find({}, 'userId lastUpdated').lean()

    // 🔹 Créer une map userId -> lastUpdated
    const conversationMap = new Map()
    conversations.forEach(conv => {
      conversationMap.set(conv.userId.toString(), conv.lastUpdated)
    })

    // 🔹 Séparer les users avec et sans conversation
    const usersWithConv = []
    const usersWithoutConv = []

    for (const user of users) {
      const userIdStr = user._id.toString()
      if (conversationMap.has(userIdStr)) {
        usersWithConv.push({ ...user, lastUpdated: conversationMap.get(userIdStr) })
      } else {
        usersWithoutConv.push(user) // déjà triés par createdAt
      }
    }

    // 🔹 Trier ceux avec conversation par lastUpdated DESC
    usersWithConv.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))

    // 🔹 Fusionner les deux
    const sortedUsers = [...usersWithConv, ...usersWithoutConv]

    return NextResponse.json(sortedUsers)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
