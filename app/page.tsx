'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDownIcon } from '@heroicons/react/24/solid'

export default function PlaygroundPage() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'close-chat-widget') {
        setIsOpen(false)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative">
      <h1 className="text-4xl font-bold text-gray-900 text-center">Pennie AI Playground</h1>

      {/* Widget Container */}
      <div
        className={`fixed bottom-24 right-6 z-50 transition-all duration-300 ease-in-out origin-bottom-right ${isOpen
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
          }`}
      >
        <iframe
          src="/chat"
          className="w-[400px] h-[600px] max-w-[90vw] max-h-[80vh] rounded-2xl shadow-2xl border border-gray-200 bg-white"
          title="Pennie AI Chat"
        />
      </div>

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-[60] overflow-hidden ${isOpen ? 'bg-[#101828] hover:bg-gray-800' : 'bg-white hover:bg-gray-50 border border-gray-200'
          }`}
      >
        {isOpen ? (
          <ChevronDownIcon className="w-8 h-8 text-white" />
        ) : (
          <div className="w-8 h-8 relative">
            <Image
              src="/migo-logo-removebg-preview.png"
              alt="Migo"
              fill
              className="object-contain"
            />
          </div>
        )}
      </button>
    </div>
  )
}
