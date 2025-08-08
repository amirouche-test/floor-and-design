'use client'

import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function AdminConversation({ selectedUser }) {
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [adminImage, setAdminImage] = useState('/user.png')
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch('/api/user/me')
        const data = await res.json()
        setAdminImage(data?.user?.image || '/user.png')
      } catch {
        toast.error("Erreur lors du chargement de l'admin")
      }
    }
    fetchAdmin()
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id) return
      setLoadingMessages(true)
      try {
        const res = await fetch(`/api/contact/${selectedUser._id}`)
        const data = await res.json()
        setMessages(data?.messages || [])
      } catch {
        toast.error("Erreur lors du chargement des messages")
      } finally {
        setLoadingMessages(false)
      }
    }
    fetchMessages()
  }, [selectedUser])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser?._id) return

    const msgToSend = {
      content: newMessage.trim(),
      sender: 'admin',
    }

    setSending(true)
    try {
      const optimistic = { ...msgToSend, timestamp: new Date() }
      setMessages(prev => [...prev, optimistic])
      setNewMessage('')

      const res = await fetch(`/api/contact/${selectedUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgToSend),
      })

      if (!res.ok) throw new Error()
    } catch {
      toast.error("Erreur lors de l'envoi du message")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col bg-white rounded h-full overflow-hidden">
      {/* HEADER UTILISATEUR */}
      {selectedUser ? (
        <div className="flex items-center gap-3 p-3 border-b bg-white">
          <img
            src={selectedUser.image || '/user.png'}
            alt={selectedUser.name || 'Utilisateur'}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="text-sm font-semibold leading-tight">{selectedUser.name}</h3>
            <p className="text-xs text-gray-500">{selectedUser.email}</p>
          </div>
        </div>
      ) : (
        <div className="p-3 text-sm text-gray-500 border-b">
          Sélectionnez un utilisateur
        </div>
      )}

      {/* ZONE DE MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50 scrollbar-hide">
        {loadingMessages ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton circle width={40} height={40} />
              <div className="flex flex-col gap-2">
                <Skeleton width={60 + i * 20} height={12} />
                <Skeleton width={160 + i * 10} height={16} />
              </div>
            </div>
          ))
        ) : (
          messages.map((message, index) => {
            const isAdmin = message.sender === 'admin'
            return (
              <div key={index} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-3 max-w-[75%] ${isAdmin ? 'flex-row-reverse' : ''}`}>
                  <img
                    src={isAdmin ? adminImage : (selectedUser?.image || '/user.png')}
                    alt={message.sender}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-gray-400">
                      {message.timestamp
                        ? new Date(message.timestamp).toLocaleString('fr-FR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })
                        : '...'}
                    </span>
                    <div
                      className={`px-4 py-2 rounded-xl text-sm text-gray-800 ${
                        isAdmin ? 'bg-blue-100' : 'bg-white shadow'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT NOUVEAU MESSAGE */}
      {selectedUser && (
        <div className="border-t px-4 py-3 flex gap-2 bg-white">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tapez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={sending}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm rounded-full transition"
            disabled={sending}
          >
            Envoyer
          </button>
        </div>
      )}
    </div>
  )
}
