'use client'
export default function AdminLayout({ children }) {
  return (
    <main className="min-h-[calc(100vh-57px)] sm:min-h-[calc(100vh-67px)] bg-gray-50 p-6">
      {children}
    </main>
  )
}
