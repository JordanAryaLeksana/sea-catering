'use client'
import React, { useState } from 'react'
import { Menu, X, Home, Users, Calendar, Settings } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '#' },
    { icon: Users, label: 'Subscriptions', href: '#' },
    { icon: Calendar, label: 'Delivery Schedule', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' }
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className={`bg-white p-2 rounded-md shadow-md ${sidebarOpen ? "hidden" : "flex"} `}
        >
          <Menu size={24} />
        </button>
      </div>

      <div className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}>

        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">SEA Catering</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4 overflow-y-auto h-full pb-20">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-1 transition-colors"
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}



      <main className="fixed top-16 bottom-0 right-0 left-0 md:left-64 overflow-y-auto bg-white">
        <div className="p-6">
          {children}
        </div>
      </main>
    </>
  )
}