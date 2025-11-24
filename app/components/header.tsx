import type { FC } from 'react'
import React from 'react'
import {
  ArrowLeftIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import Image from 'next/image'

export interface IHeaderProps {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}

const Header: FC<IHeaderProps> = () => {
  return (
    <div className="shrink-0 flex items-center justify-between py-3 px-4 bg-gradient-to-r from-[#7F56D9] to-[#444CE7] text-white">
      {/* Left: Back Arrow */}
      <div className="flex items-center justify-center w-8 h-8 cursor-pointer hover:bg-white/10 rounded-full">
        <ArrowLeftIcon className="h-6 w-6 text-white" />
      </div>

      {/* Center: Logo + Title + Subtitle */}
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-8 h-8 relative bg-white rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src="/migo-logo-removebg-preview.png"
              alt="Migo Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="text-lg font-semibold">Migo</div>
        </div>
        <div className="text-xs opacity-90 font-light">Your automated AI financial companion</div>
      </div>

      {/* Right: Close Button */}
      <div className="flex items-center justify-center w-8 h-8 cursor-pointer hover:bg-white/10 rounded-full">
        <XMarkIcon className="h-6 w-6 text-white" />
      </div>
    </div>
  )
}

export default React.memo(Header)
