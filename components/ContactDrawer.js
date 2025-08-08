// components/ContactDrawer.jsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function ContactDrawer({ open, onClose }) {
  const [user, setUser] = useState(null)
  const [adminImage] = useState('/assis.png')
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/me')
        const data = await res.json()
        setUser(data?.user)
      } catch {
        toast.error("Erreur utilisateur")
      }
    }
    fetchUser()
  }, [open])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return
      setLoadingMessages(true)
      try {
        const res = await fetch(`/api/contact/${user._id}`)
        const data = await res.json()
        setMessages(data?.messages || [])
      } catch {
        toast.error("Erreur messages")
      } finally {
        setLoadingMessages(false)
      }
    }
    fetchMessages()
  }, [user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return

    const messageData = {
      content: newMessage.trim(),
      sender: 'user',
    }

    setSending(true)
    setMessages(prev => [...prev, { ...messageData, timestamp: new Date() }])
    setNewMessage('')

    try {
      const res = await fetch(`/api/contact/${user._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      })
      if (!res.ok) throw new Error()
    } catch {
      toast.error("Erreur d'envoi")
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      className={`fixed top-0 right-0 w-full sm:w-[400px] h-screen bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col`} // ← Ajoute flex-col ici
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-sm font-semibold text-blue-950">Floor & Design</h2>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-600 cursor-pointer hover:text-red-500" />
        </button>
      </div>
  
      {/* ZONE SCROLLABLE DES MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50 scrollbar-hide">
        {loadingMessages
          ? [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton circle width={36} height={36} />
                <div className="flex flex-col gap-1">
                  <Skeleton width={80} height={12} />
                  <Skeleton width={180} height={16} />
                </div>
              </div>
            ))
          : messages.map((msg, i) => {
              const isUser = msg.sender === 'user'
              return (
                <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`}>
                    <img
                      src={isUser ? user?.image || '/user.png' : adminImage}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col space-y-1">
                      <span className="text-[11px] text-gray-400">
                        {new Date(msg.timestamp).toLocaleString('fr-FR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </span>
                      <div
                        className={`px-4 py-2 rounded-xl text-sm ${
                          isUser ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-700 shadow'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        <div ref={bottomRef} />
      </div>
  
      {/* INPUT FIXÉ EN BAS */}
      <div className="border-t px-4 py-3 flex gap-2 bg-white">
        <input
          type="text"
          placeholder="Écrire un message..."
          className="flex-1 text-black border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={sending}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm rounded-full transition"
          disabled={sending}
        >
          Envoyer
        </button>
      </div>
    </div>
  )
} 