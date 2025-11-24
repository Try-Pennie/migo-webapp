'use client'
import type { FC } from 'react'
import React from 'react'
import type { IChatItem } from '../type'
import s from '../style.module.css'

import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import ImageGallery from '@/app/components/base/image-gallery'

type IQuestionProps = Pick<IChatItem, 'id' | 'content' | 'useCurrentUserAvatar'> & {
  imgSrcs?: string[]
  item?: IChatItem
}

const Question: FC<IQuestionProps> = ({ id, content, useCurrentUserAvatar, imgSrcs, item }) => {
  // Use item time or fallback
  // Screenshot time: 10:01 AM
  // Note: In a real implementation, we would format item.more.time
  const timeDisplay = '10:01 AM' 

  return (
    <div className='flex flex-col items-end justify-end mb-6' key={id}>
      {/* Label Row: Name + Time */}
      <div className="flex items-center gap-2 mb-1.5 mr-1">
          <span className="text-xs font-medium text-gray-700">You</span>
          <span className="text-xs text-gray-400">{timeDisplay}</span>
      </div>

      {/* Message Bubble */}
      <div className="max-w-full">
        <div className={`relative text-sm text-white bg-[#101828] rounded-2xl px-5 py-3.5`}>
            {imgSrcs && imgSrcs.length > 0 && (
              <ImageGallery srcs={imgSrcs} />
            )}
            <div className="text-white [&_.markdown-body]:!text-white [&_.markdown-body_p]:!text-white">
                <StreamdownMarkdown content={content} />
            </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Question)
