'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, Box, Clock } from 'lucide-react'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboardPage() {

  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats')
        const data = await res.json()

        const last12Months = getLast12Months()
        const monthData = last12Months.map(m => {
          const found = data.productsPerMonth.find(item => item._id === m._id)
          return {
            _id: m._id,
            label: m.label,
            count: found ? found.count : 0
          }
        })

        setStats({ ...data, productsPerMonth: monthData })
      } catch (err) {
        console.error('Erreur chargement stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F97316', '#10B981']

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-8 w-48 bg-gray-300 rounded"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-4 rounded-xl shadow h-80"></div>
            <div className="bg-white p-4 rounded-xl shadow h-80"></div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow h-64"></div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return <p className="text-center mt-10 text-red-500">Erreur lors du chargement des données.</p>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Tableau de bord</h1>

        {/* Top cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card icon={<Box size={24} />} title="Produits" value={stats.productCount} />
          <Card icon={<Users size={24} />} title="Utilisateurs" value={stats.userCount} />
          <Card icon={<TrendingUp size={24} />} title="Catégories" value={stats.productsPerCategory.length} />
          <Card 
            icon={<Clock size={24} />} 
            title="Dernier produit"
            value={stats.lastProduct ? stats.lastProduct.name : 'N/A'} 
            image={
              stats.lastProduct && (
                <Link href={`/admin/produits/${stats.lastProduct.slug}`}>
                  <img 
                    src={stats.lastProduct.image || '/placeholder.png'}
                    alt={stats.lastProduct.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </Link>
              )
            }
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie chart */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Répartition par catégorie</h2>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-1/2 flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.productsPerCategory.map(item => ({ name: item._id, value: item.count }))}
                      cx="50%" cy="50%" outerRadius={100}
                      dataKey="value"
                    >
                      {stats.productsPerCategory.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 flex justify-center md:justify-start">
                <div className="flex flex-col space-y-2">
                  {stats.productsPerCategory.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="text-sm text-gray-600">{item._id} ({item.count})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Produits ajoutés par mois</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.productsPerMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top produits */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Top 5 produits les plus chers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b text-gray-500 uppercase text-xs tracking-wider bg-gray-50">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Produit</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4">Prix (DA)</th>
                  <th className="py-3 px-4">Nb Motifs</th>
                  <th className="py-3 px-4">Créé le</th>
                  <th className="py-3 px-4">Modifié le</th>
                </tr>
              </thead>
              <tbody>
                {stats.topProducts.map((prod, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/produits/${prod.slug}`)}
                  >
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <img src={prod.image || '/placeholder.png'} alt={prod.name} className="w-10 h-10 object-cover rounded border" />
                      <span className="font-medium text-gray-800">{prod.name}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{prod.category}</td>
                    <td className="py-3 px-4 text-gray-700 font-semibold">{prod.price.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-600 font-semibold">
                        {prod.motifCount ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{dayjs(prod.createdAt).format('DD/MM/YYYY')}</td>
                    <td className="py-3 px-4 text-gray-500">{dayjs(prod.updatedAt).format('DD/MM/YYYY')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ icon, title, value, image }) {
  return (
    <div className="bg-white rounded-xl shadow flex items-center justify-between p-4 space-x-4">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">{icon}</div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
      {image}
    </div>
  )
}

// Fonction helper pour 12 derniers mois
function getLast12Months() {
  const months = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthNumber = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    months.push({
      _id: `${year}-${monthNumber}`,
      label: d.toLocaleString('default', { month: 'short' }) + ' ' + year,
      count: 0
    })
  }
  return months
}
