import React, { useState } from 'react'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import Header from '@/app/components/header'
import type { ConversationItem } from '@/types/app'
import { APP_INFO } from '@/config'

interface ConversationListProps {
  conversationList: ConversationItem[]
  currConversationId: string
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onClose: () => void
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversationList,
  currConversationId,
  onSelectConversation,
  onNewConversation,
  onClose,
}) => {
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')

  const filteredList = conversationList
    .filter(item => item.id !== '-1') // Exclude temporary new chat item
    .filter(item => 
      item.name.toLowerCase().includes(searchText.toLowerCase())
    )

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title={APP_INFO?.title || 'Migo'} 
        onClose={onClose} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden max-w-[800px] w-full mx-auto relative">
        {/* Search Bar */}
        <div className="p-4 bg-gray-50 sticky top-0 z-10">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-lg border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 bg-white outline-none"
              placeholder="Search conversations..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          <div className="space-y-3">
            {filteredList.map((item) => {
                const isActive = item.id === currConversationId
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectConversation(item.id)}
                    className={`group relative flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md bg-white ${
                      isActive 
                        ? 'border-primary-600 ring-1 ring-primary-600' 
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                        <h3 className={`text-base font-semibold line-clamp-1 pr-2 ${isActive ? 'text-primary-700' : 'text-gray-900'}`}>
                            {item.name}
                        </h3>
                        {/* Simulated time for now since it's not in the type */}
                        <span className="text-xs text-gray-400 shrink-0 mt-1">Today</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                        {/* Use introduction or inputs if available, fallback to a generic text if empty */}
                        {item.introduction || (item.inputs ? Object.values(item.inputs).join(' ') : '') || t('app.chat.newChatDefaultName')}
                    </p>
                    
                    {isActive && (
                        <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary-600 rounded-r-full" />
                    )}
                  </div>
                )
            })}
             
            {filteredList.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <p>No conversations found.</p>
                </div>
            )}
          </div>
        </div>

        {/* Bottom Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pt-8">
            <button
                onClick={onNewConversation}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 px-4 rounded-full shadow-lg transition-colors duration-200"
            >
                <PlusIcon className="h-5 w-5" />
                Start New Conversation
            </button>
        </div>
      </div>
    </div>
  )
}

export default ConversationList

