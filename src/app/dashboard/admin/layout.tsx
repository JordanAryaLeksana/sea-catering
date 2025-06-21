'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const toggleSidebar = () => setIsOpen(!isOpen)
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white p-4 transition-transform transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:inset-auto md:transform-none`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Admin</h2>
          <Button
            variant="ghost"
            className="md:hidden p-1"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="space-y-2">
          <Link href="/dashboard/admin" className="block hover:bg-gray-700 rounded p-2">Dashboard</Link>
          <Link href="#" className="block hover:bg-gray-700 rounded p-2">Subscriptions</Link>
          <Link href="#" className="block hover:bg-gray-700 rounded p-2">Reports</Link>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Mobile top bar */}
        <div className="md:hidden p-4 bg-gray-100 flex items-center justify-between">
          <Button variant="ghost" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>
        {/* Page content */}
        <main className="p-6 bg-gray-100 flex-1">{children}</main>
      </div>
    </div>
  )
}
